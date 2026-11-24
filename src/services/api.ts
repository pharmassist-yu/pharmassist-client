// Base API configuration; endpoints will be added in upcoming sprints.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export type RegistrationResult =
  { success: true } | { success: false; error: 'email-already-registered' };

export const MOCK_REGISTERED_EMAIL = 'registered@pharmassist.test';

export async function register(input: RegistrationRequest): Promise<RegistrationResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (input.email.trim().toLowerCase() === MOCK_REGISTERED_EMAIL) {
    return { success: false, error: 'email-already-registered' };
  }

  return { success: true };
}
