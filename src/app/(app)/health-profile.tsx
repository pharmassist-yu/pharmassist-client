import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsDesktop } from '@/components/AppShell';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizes } from '@/constants/typography';

export default function HealthProfileScreen() {
  const { signOut } = useAuth();
  const isDesktop = useIsDesktop();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <ScreenHeader
          title="Sağlık Profili"
          subtitle="Kişisel sağlık bilgileriniz, alerjileriniz ve kronik rahatsızlıklarınız burada yer alacaktır."
        />

        <PlaceholderCard
          icon="person-outline"
          title="Sağlık Profili Yer Tutucu"
          description="Hasta bilgileri, kayıtlı hastalıklar ve alerji listesi iş mantığı eklendiğinde bu ekranda yönetilecektir."
        >
          {!isDesktop && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Çıkış Yap"
              onPress={() => {
                signOut();
                router.replace('/welcome');
              }}
              style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
            </Pressable>
          )}
        </PlaceholderCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  container: {
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dangerSoft,
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.danger,
  },
  pressed: {
    opacity: 0.8,
  },
});
