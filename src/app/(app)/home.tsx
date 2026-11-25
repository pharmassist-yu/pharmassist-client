import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useIsDesktop } from '@/components/AppShell';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';
import { ApiError, getEndpointUrl, pingBackend, type PingResult } from '@/services/api';

type PingState =
  | { status: 'loading' }
  | { status: 'success'; result: PingResult }
  | { status: 'error'; message: string };

async function fetchPingState(signal: AbortSignal): Promise<PingState> {
  try {
    const result = await pingBackend(signal);
    return { status: 'success', result };
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.userMessage
        : 'Sunucuya bağlanırken beklenmeyen bir hata oluştu.';
    return { status: 'error', message };
  }
}

export default function HomeScreen() {
  const isDesktop = useIsDesktop();
  const [pingState, setPingState] = useState<PingState>({ status: 'loading' });
  const pingEndpointLabel = getEndpointUrl('/api/ping') ?? 'EXPO_PUBLIC_API_URL tanımlı değil';

  useEffect(() => {
    if (pingState.status !== 'loading') {
      return;
    }

    const controller = new AbortController();

    void fetchPingState(controller.signal).then((nextState) => {
      if (!controller.signal.aborted) {
        setPingState(nextState);
      }
    });

    return () => {
      controller.abort();
    };
  }, [pingState.status]);

  const handleRetryPing = () => {
    setPingState({ status: 'loading' });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <ScreenHeader
          title="Ana Sayfa"
          subtitle="Günlük ilaç özetiniz ve yaklaşan hatırlatıcılarınız burada yer alacaktır."
        />

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusTitleRow}>
              <View
                style={[
                  styles.statusIconBox,
                  pingState.status === 'success' && styles.statusIconSuccess,
                  pingState.status === 'error' && styles.statusIconError,
                ]}
              >
                {pingState.status === 'loading' ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Ionicons
                    name={
                      pingState.status === 'success'
                        ? 'cloud-done-outline'
                        : 'cloud-offline-outline'
                    }
                    size={20}
                    color={pingState.status === 'success' ? Colors.success : Colors.danger}
                  />
                )}
              </View>
              <View style={styles.statusTitleGroup}>
                <Text style={styles.statusTitle}>Sunucu Bağlantısı</Text>
                <Text style={styles.statusEndpoint} numberOfLines={1}>
                  {pingEndpointLabel}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sunucu bağlantısını tekrar dene"
              disabled={pingState.status === 'loading'}
              onPress={handleRetryPing}
              style={({ pressed }) => [
                styles.retryButton,
                pingState.status === 'loading' && styles.retryButtonDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </Pressable>
          </View>

          {pingState.status === 'loading' && (
            <Text style={styles.statusInfoText}>Sunucu bağlantısı kontrol ediliyor...</Text>
          )}

          {pingState.status === 'success' && (
            <View style={styles.statusSuccessBox}>
              <Text style={styles.statusSuccessLabel}>
                Bağlantı başarılı (HTTP {pingState.result.statusCode})
              </Text>
              <Text style={styles.statusSuccessBody}>Yanıt: {pingState.result.message}</Text>
            </View>
          )}

          {pingState.status === 'error' && (
            <View style={styles.statusErrorBox}>
              <Text style={styles.statusErrorText}>{pingState.message}</Text>
            </View>
          )}
        </View>

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
  statusCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 180,
  },
  statusIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconSuccess: {
    backgroundColor: Colors.successSoft,
  },
  statusIconError: {
    backgroundColor: Colors.dangerSoft,
  },
  statusTitleGroup: {
    flex: 1,
    gap: 2,
  },
  statusTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text,
  },
  statusEndpoint: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  retryButtonDisabled: {
    opacity: 0.5,
  },
  retryButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  statusInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  statusSuccessBox: {
    backgroundColor: Colors.successSoft,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  statusSuccessLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.success,
  },
  statusSuccessBody: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  statusErrorBox: {
    backgroundColor: Colors.dangerSoft,
    borderRadius: 12,
    padding: 12,
  },
  statusErrorText: {
    fontSize: FontSizes.sm,
    color: Colors.danger,
    lineHeight: 20,
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
