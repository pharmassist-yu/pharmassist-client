import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';
import { register } from '@/services/api';
import {
  MIN_PASSWORD_LENGTH,
  type RegistrationFieldErrors,
  type RegistrationFormValues,
  validateRegistration,
} from '@/services/registrationValidation';

const EMPTY_FORM: RegistrationFormValues = {
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export default function RegisterScreen() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);

  const updateField = (field: keyof RegistrationFormValues, value: string) => {
    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);
    setFeedback(null);
    if (hasSubmitted) {
      setErrors(validateRegistration(updatedValues));
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setFeedback(null);

    const validationErrors = validateRegistration(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (result.success) {
        setFeedback({ message: 'Hesabınız başarıyla oluşturuldu.', success: true });
        setValues((currentValues) => ({
          ...currentValues,
          password: '',
          passwordConfirmation: '',
        }));
      } else {
        setFeedback({ message: 'Bu e-posta adresi zaten kayıtlı.', success: false });
      }
    } catch {
      setFeedback({
        message: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (error?: string) =>
    error ? (
      <Text accessibilityRole="alert" style={styles.fieldError}>
        {error}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.brand}>PharmAssist</Text>

          <ScreenHeader
            title="Kayıt Ol"
            subtitle="Yeni bir PharmAssist hesabı oluşturun."
            showBack
            backFallback="/welcome"
          />

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput
                accessibilityLabel="Ad Soyad"
                accessibilityHint="Adınızı ve soyadınızı girin."
                autoComplete="name"
                autoCapitalize="words"
                onChangeText={(value) => updateField('fullName', value)}
                placeholder="Adınız Soyadınız"
                placeholderTextColor={Colors.textSecondary}
                returnKeyType="next"
                style={[styles.input, errors.fullName && styles.inputError]}
                value={values.fullName}
              />
              {renderFieldError(errors.fullName)}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-posta</Text>
              <TextInput
                accessibilityLabel="E-posta"
                accessibilityHint="E-posta adresinizi girin."
                autoComplete="email"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(value) => updateField('email', value)}
                placeholder="ornek@eposta.com"
                placeholderTextColor={Colors.textSecondary}
                returnKeyType="next"
                style={[styles.input, errors.email && styles.inputError]}
                value={values.email}
              />
              {renderFieldError(errors.email)}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                accessibilityLabel="Şifre"
                accessibilityHint={`En az ${MIN_PASSWORD_LENGTH} karakter uzunluğunda bir şifre girin.`}
                autoComplete="new-password"
                onChangeText={(value) => updateField('password', value)}
                placeholder="Şifreniz"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                style={[styles.input, errors.password && styles.inputError]}
                value={values.password}
              />
              {renderFieldError(errors.password)}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Şifre Tekrarı</Text>
              <TextInput
                accessibilityLabel="Şifre Tekrarı"
                accessibilityHint="Şifrenizi tekrar girin."
                autoComplete="new-password"
                onChangeText={(value) => updateField('passwordConfirmation', value)}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                style={[styles.input, errors.passwordConfirmation && styles.inputError]}
                value={values.passwordConfirmation}
              />
              {renderFieldError(errors.passwordConfirmation)}
            </View>

            {feedback ? (
              <Text
                accessibilityRole="alert"
                style={[
                  styles.feedback,
                  feedback.success ? styles.successFeedback : styles.errorFeedback,
                ]}
              >
                {feedback.message}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kayıt Ol"
              accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && !isSubmitting && styles.pressed,
                isSubmitting && styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Kayıt Ol</Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Giriş Yap ekranına git"
              onPress={() => router.replace('/login')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
            >
              <Text style={styles.linkText}>Zaten hesabınız var mı? Giriş Yap</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  brand: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontSize: FontSizes.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  fieldError: {
    color: Colors.danger,
    fontSize: FontSizes.sm,
  },
  feedback: {
    borderRadius: 10,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    padding: 12,
  },
  successFeedback: {
    backgroundColor: Colors.successSoft,
    color: Colors.success,
  },
  errorFeedback: {
    backgroundColor: Colors.dangerSoft,
    color: Colors.danger,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
  linkButton: {
    minHeight: 48,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
