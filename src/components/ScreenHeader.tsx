import { Ionicons } from '@expo/vector-icons';
import { type Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useIsDesktop } from '@/components/AppShell';
import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backFallback?: Href;
  hideBackOnDesktop?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  backFallback = '/home',
  hideBackOnDesktop = false,
}: ScreenHeaderProps) {
  const isDesktop = useIsDesktop();
  const shouldShowBack = showBack && !(hideBackOnDesktop && isDesktop);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(backFallback);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {shouldShowBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </Pressable>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
