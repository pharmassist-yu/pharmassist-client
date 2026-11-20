import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.brandBlock}>
            <Text style={styles.brand}>PharmAssist</Text>
            <Text style={styles.tagline}>İlaç Yönetimi ve Bilgilendirme</Text>
          </View>

          <PlaceholderCard
            icon="medical-outline"
            title="Hoş Geldiniz"
            description="Bu alan PharmAssist karşılama ekranı için yer tutucu içeriktir. Giriş veya kayıt ekranlarına aşağıdaki butonlardan geçebilirsiniz."
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Giriş Yap"
              onPress={() => router.push('/login')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Giriş Yap</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Kayıt Ol"
              onPress={() => router.push('/register')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>Kayıt Ol</Text>
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
    gap: 24,
  },
  brandBlock: {
    alignItems: 'center',
    gap: 6,
  },
  brand: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.primary,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
