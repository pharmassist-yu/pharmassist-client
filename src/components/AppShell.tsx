import { type ComponentProps, type ReactNode, useSyncExternalStore } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { type Href, router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { FontSizes } from '@/constants/typography';

export const DESKTOP_BREAKPOINT = 768;

const emptySubscribe = () => () => {};

export function useIsDesktop(): boolean {
  const { width } = useWindowDimensions();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return isHydrated && width >= DESKTOP_BREAKPOINT;
}

export function resetTo(href: Href) {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace(href);
}

type IconName = ComponentProps<typeof Ionicons>['name'];

interface NavItem {
  label: string;
  href: Href;
  icon: IconName;
  activeIcon: IconName;
}

const SIDEBAR_MAIN_ITEMS: readonly NavItem[] = [
  {
    label: 'Ana Sayfa',
    href: '/home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    label: 'İlaç Arama',
    href: '/medication-search',
    icon: 'search-outline',
    activeIcon: 'search',
  },
];

const SIDEBAR_ACCOUNT_ITEM: NavItem = {
  label: 'Profil',
  href: '/health-profile',
  icon: 'person-outline',
  activeIcon: 'person',
};

const BOTTOM_NAV_ITEMS: readonly NavItem[] = [
  {
    label: 'Ana Sayfa',
    href: '/home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    label: 'Profil',
    href: '/health-profile',
    icon: 'person-outline',
    activeIcon: 'person',
  },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { signOut } = useAuth();
  const isDesktop = useIsDesktop();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const handleNavigate = (href: Href) => {
    if (pathname === href) {
      return;
    }
    resetTo(href);
  };

  const handleLogout = () => {
    signOut();
    router.replace('/welcome');
  };

  if (isDesktop) {
    const isAccountActive = pathname === SIDEBAR_ACCOUNT_ITEM.href;

    return (
      <View style={styles.desktopContainer}>
        <View style={[styles.sidebar, { paddingTop: Math.max(insets.top, 24) }]}>
          <Text style={styles.brand}>PharmAssist</Text>

          <View style={styles.sidebarNav}>
            {SIDEBAR_MAIN_ITEMS.map((item) => {
              const isActive =
                item.href === '/home'
                  ? pathname === '/home' || pathname === '/reminders'
                  : pathname === item.href;

              return (
                <Pressable
                  key={String(item.href)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => handleNavigate(item.href)}
                  style={({ pressed }) => [
                    styles.sidebarItem,
                    isActive && styles.sidebarItemActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={20}
                    color={isActive ? Colors.primary : Colors.textSecondary}
                  />
                  <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.sidebarFooter, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={SIDEBAR_ACCOUNT_ITEM.label}
              onPress={() => handleNavigate(SIDEBAR_ACCOUNT_ITEM.href)}
              style={({ pressed }) => [
                styles.sidebarItem,
                isAccountActive && styles.sidebarItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isAccountActive ? SIDEBAR_ACCOUNT_ITEM.activeIcon : SIDEBAR_ACCOUNT_ITEM.icon}
                size={20}
                color={isAccountActive ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[styles.sidebarItemText, isAccountActive && styles.sidebarItemTextActive]}
              >
                {SIDEBAR_ACCOUNT_ITEM.label}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Çıkış Yap"
              onPress={handleLogout}
              style={({ pressed }) => [styles.sidebarItem, pressed && styles.pressed]}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.mobileContainer}>
      <View style={[styles.mobileTopBar, { paddingTop: Math.max(insets.top, 12) }]}>
        <Text style={styles.brand}>PharmAssist</Text>
      </View>

      <View style={styles.content}>{children}</View>

      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/health-profile'
              ? pathname === '/health-profile'
              : pathname !== '/health-profile';

          return (
            <Pressable
              key={String(item.href)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => handleNavigate(item.href)}
              style={({ pressed }) => [
                styles.bottomNavItem,
                isActive && styles.bottomNavItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={22}
                color={isActive ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  sidebar: {
    width: 248,
    backgroundColor: Colors.surface,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingHorizontal: 16,
  },
  brand: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: 8,
  },
  sidebarNav: {
    marginTop: 28,
    gap: 6,
    flex: 1,
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    gap: 6,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sidebarItemActive: {
    backgroundColor: Colors.primarySoft,
  },
  sidebarItemText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  sidebarItemTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  logoutText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.danger,
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mobileTopBar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  bottomNavItemActive: {
    backgroundColor: Colors.primarySoft,
  },
  bottomNavLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  bottomNavLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
