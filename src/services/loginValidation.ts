export interface LoginFormValues {
  email: string;
  password: string;
}

export type LoginFieldErrors = Partial<Record<keyof LoginFormValues, string>>;

export function validateLogin(values: LoginFormValues): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!values.email.trim()) {
    errors.email = 'E-posta alanı zorunludur.';
  }

  if (!values.password) {
    errors.password = 'Şifre alanı zorunludur.';
  }

  return errors;
}
