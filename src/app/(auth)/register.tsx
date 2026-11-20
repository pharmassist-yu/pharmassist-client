import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetTo } from '@/components/AppShell';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.brand}>PharmAssist</Text>

          <ScreenHeader
            title="Kayıt Ol"
            subtitle="Yeni bir PharmAssist hesabı oluşturun."
            showBack
            backFallback="/welcome"
          />

          <PlaceholderCard
            icon="person-add-outline"
            title="Kayıt Ekranı Yer Tutucu"
            description="Kullanıcı kayıt formu ve doğrulama adımları sonraki aşamada eklenecektir. Navigasyonu test etmek için geçici geçiş butonunu kullanabilirsiniz."
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
              accessibilityLabel="Giriş Yap ekranına git"
              onPress={() => router.replace('/login')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
            >
              <Text style={styles.linkText}>Zaten hesabınız var mı? Giriş Yap</Text>
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
