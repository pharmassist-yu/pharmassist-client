import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsDesktop } from '@/components/AppShell';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

export default function HomeScreen() {
  const isDesktop = useIsDesktop();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <ScreenHeader
          title="Ana Sayfa"
          subtitle="Günlük ilaç özetiniz ve yaklaşan hatırlatıcılarınız burada yer alacaktır."
        />

        <PlaceholderCard
          icon="calendar-outline"
          title="Günlük İlaç Özeti Yer Tutucu"
          description="Bugünün ilaç listesi ve doz durumları iş mantığı geliştirildiğinde bu bölümde görüntülenecektir."
        />

        <Text style={styles.sectionTitle}>
          {isDesktop ? 'Yaklaşan Hatırlatıcılar' : 'Hızlı Erişim'}
        </Text>

        <View style={styles.quickLinks}>
          {!isDesktop && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="İlaç Arama ekranına git"
              onPress={() => router.push('/medication-search')}
              style={({ pressed }) => [styles.navCard, pressed && styles.pressed]}
            >
              <View style={styles.navCardLeft}>
                <View style={styles.navIconBox}>
                  <Ionicons name="search-outline" size={22} color={Colors.primary} />
                </View>
                <View style={styles.navTextGroup}>
                  <Text style={styles.navCardTitle}>İlaç Arama</Text>
                  <Text style={styles.navCardSubtitle}>
                    Prospektüs ve etken madde arama ekranına geçin
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hatırlatıcılar ekranına git"
            onPress={() => router.push('/reminders')}
            style={({ pressed }) => [styles.navCard, pressed && styles.pressed]}
          >
            <View style={styles.navCardLeft}>
              <View style={styles.navIconBox}>
                <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.navTextGroup}>
                <Text style={styles.navCardTitle}>Hatırlatıcılar</Text>
                <Text style={styles.navCardSubtitle}>
                  Yaklaşan doz alarmları ve planlama ekranına geçin
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </Pressable>
        </View>
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
    gap: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  quickLinks: {
    gap: 12,
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  navCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  navIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTextGroup: {
    flex: 1,
    gap: 2,
  },
  navCardTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  navCardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  pressed: {
    opacity: 0.75,
  },
});
