const DEFAULT_TIMEOUT_MS = 8000;

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim() ?? '';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export type ApiErrorCode = 'CONFIG_ERROR' | 'TIMEOUT' | 'NETWORK_ERROR' | 'HTTP_ERROR';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  readonly userMessage: string;

  constructor(
    message: string,
    options: { code: ApiErrorCode; userMessage: string; status?: number },
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code;
    this.status = options.status;
    this.userMessage = options.userMessage;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface PingResult {
  statusCode: number;
  message: string;
}

function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new ApiError('EXPO_PUBLIC_API_URL environment variable is not configured.', {
      code: 'CONFIG_ERROR',
      userMessage:
        'Sunucu adresi yapılandırılmamış. Lütfen .env dosyasında EXPO_PUBLIC_API_URL değerini tanımlayın.',
    });
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Avoid duplicate /api/api prefix if EXPO_PUBLIC_API_URL already ends with /api.
  if (API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${API_BASE_URL}${normalizedPath.slice(4)}`;
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

export function getEndpointUrl(path: string): string | null {
  if (!API_BASE_URL) {
    return null;
  }
  return buildApiUrl(path);
}

function mapHttpStatusToUserMessage(status: number): string {
  if (status === 401) {
    return 'Oturum doğrulaması başarısız oldu (401).';
  }
  if (status === 403) {
    return 'Bu işlem için yetkiniz bulunmuyor (403).';
  }
  if (status === 404) {
    return 'İstenen sunucu uç noktası bulunamadı (404).';
  }
  if (status >= 500) {
    return `Sunucu tarafında bir hata oluştu (${status}). Lütfen daha sonra tekrar deneyin.`;
  }
  return `Sunucu isteği reddetti (HTTP ${status}).`;
}

function parseResponseBody(rawText: string): unknown {
  const trimmed = rawText.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return trimmed;
  }
}

function extractReadableResponse(data: unknown, statusCode: number): string {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data.trim();
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.trim().length > 0) {
      return record.message.trim();
    }
    if (typeof record.status === 'string' && record.status.trim().length > 0) {
      return record.status.trim();
    }
    return JSON.stringify(data);
  }

  return `HTTP ${statusCode} OK`;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<{ status: number; data: T }> {
  const { method = 'GET', body, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;
  const url = buildApiUrl(path);

  const controller = new AbortController();
  let timedOut = false;

  const handleExternalAbort = () => {
    controller.abort();
  };

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', handleExternalAbort);
    }
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json, text/plain',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const rawText = await response.text();
    const parsedData = parseResponseBody(rawText);

    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status} error for ${method} ${url}`, {
        code: 'HTTP_ERROR',
        status: response.status,
        userMessage: mapHttpStatusToUserMessage(response.status),
      });
    }

    return {
      status: response.status,
      data: parsedData as T,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (signal?.aborted) {
      throw error;
    }

    if (timedOut) {
      throw new ApiError(`Request timed out after ${timeoutMs}ms (${method} ${url})`, {
        code: 'TIMEOUT',
        userMessage:
          'Sunucuya bağlanılamadı (zaman aşımı). Sunucunun çalıştığını ve aynı ağda olduğunuzu kontrol edin.',
      });
    }

    const technicalMessage =
      error instanceof Error ? error.message : `Network request failed (${method} ${url})`;

    throw new ApiError(technicalMessage, {
      code: 'NETWORK_ERROR',
      userMessage:
        'Sunucuya ulaşılamıyor. Backend sunucusunun açık olduğunu ve internet/Wi-Fi bağlantınızı kontrol edin.',
    });
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', handleExternalAbort);
  }
}

export async function pingBackend(signal?: AbortSignal): Promise<PingResult> {
  const { status, data } = await apiRequest<unknown>('/api/ping', {
    method: 'GET',
    signal,
  });

  return {
    statusCode: status,
    message: extractReadableResponse(data, status),
  };
}
