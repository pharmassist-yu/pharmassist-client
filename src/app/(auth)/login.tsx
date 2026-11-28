import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizes } from '@/constants/typography';
import { login } from '@/services/api';
import {
  validateLogin,
  type LoginFieldErrors,
  type LoginFormValues,
} from '@/services/loginValidation';

const EMPTY_FORM: LoginFormValues = {
  email: '',
  password: '',
};

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateField = (field: keyof LoginFormValues, value: string) => {
    const updatedValues = { ...values, [field]: value };
    setValues(updatedValues);
    setFeedback(null);
    if (hasSubmitted) {
      setErrors(validateLogin(updatedValues));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setHasSubmitted(true);
    setFeedback(null);

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!result.success) {
        setFeedback('E-posta adresi veya şifre hatalı. Lütfen tekrar deneyin.');
        return;
      }

      signIn(result.token);
      router.replace('/home');
    } catch {
      setFeedback('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
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
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined
        }
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.brand}>PharmAssist</Text>

            <ScreenHeader
              title="Giriş Yap"
              subtitle="İlaç bilgilerinize ve hatırlatıcılarınıza erişin."
            />

            <View style={styles.form}>
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
                <View style={[styles.passwordInputRow, errors.password && styles.inputError]}>
                  <TextInput
                    accessibilityLabel="Şifre"
                    accessibilityHint="Hesap şifrenizi girin."
                    autoComplete="current-password"
                    onChangeText={(value) => updateField('password', value)}
                    onSubmitEditing={handleSubmit}
                    placeholder="Şifreniz"
                    placeholderTextColor={Colors.textSecondary}
                    returnKeyType="go"
                    secureTextEntry={!isPasswordVisible}
                    style={styles.passwordInput}
                    value={values.password}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isPasswordVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    accessibilityState={{ selected: isPasswordVisible }}
                    onPress={() => setIsPasswordVisible((visible) => !visible)}
                    style={({ pressed }) => [
                      styles.passwordVisibilityButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={Colors.textSecondary}
                    />
                  </Pressable>
                </View>
                {renderFieldError(errors.password)}
              </View>

              {feedback ? (
                <Text accessibilityRole="alert" style={styles.feedback}>
                  {feedback}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Giriş Yap"
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
                  <Text style={styles.primaryButtonText}>Giriş Yap</Text>
                )}
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Kayıt Ol ekranına git"
                onPress={() => router.replace('/register')}
                style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
              >
                <Text style={styles.linkText}>Hesabınız yok mu? Kayıt Ol</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    gap: 20,
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
  passwordInputRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  passwordInput: {
    flex: 1,
    minHeight: 48,
    color: Colors.text,
    fontSize: FontSizes.md,
    paddingLeft: 14,
    paddingRight: 0,
    paddingVertical: 12,
  },
  passwordVisibilityButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.dangerSoft,
    color: Colors.danger,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    padding: 12,
  },
  brand: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
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
