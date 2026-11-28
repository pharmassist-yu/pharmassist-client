export const MIN_PASSWORD_LENGTH = 15;

export interface RegistrationFormValues {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type RegistrationFieldErrors = Partial<Record<keyof RegistrationFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistration(values: RegistrationFormValues): RegistrationFieldErrors {
  const errors: RegistrationFieldErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Ad soyad alanı zorunludur.';
  }

  if (!values.email.trim()) {
    errors.email = 'E-posta alanı zorunludur.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi girin.';
  }

  if (!values.password) {
    errors.password = 'Şifre alanı zorunludur.';
  } else if (Array.from(values.password).length < MIN_PASSWORD_LENGTH) {
    errors.password = `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`;
  }

  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = 'Şifre tekrarı alanı zorunludur.';
  } else if (values.password !== values.passwordConfirmation) {
    errors.passwordConfirmation = 'Şifreler eşleşmiyor.';
  }

  return errors;
}
