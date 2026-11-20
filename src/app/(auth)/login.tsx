import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetTo } from '@/components/AppShell';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.brand}>PharmAssist</Text>

          <ScreenHeader
            title="Giriş Yap"
            subtitle="İlaç bilgilerinize ve hatırlatıcılarınıza erişin."
            showBack
            backFallback="/welcome"
          />

          <PlaceholderCard
            icon="log-in-outline"
            title="Giriş Ekranı Yer Tutucu"
            description="E-posta ve şifre ile kimlik doğrulama formu sonraki aşamada eklenecektir. Navigasyonu test etmek için geçici geçiş butonunu kullanabilirsiniz."
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ana Sayfaya Geç"
              onPress={() => resetTo('/home')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Ana Sayfaya Geç (Önizleme)</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kayıt Ol ekranına git"
              onPress={() => router.replace('/register')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
            >
              <Text style={styles.linkText}>Hesabınız yok mu? Kayıt Ol</Text>
            </Pressable>
          </PlaceholderCard>
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
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.white,
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
