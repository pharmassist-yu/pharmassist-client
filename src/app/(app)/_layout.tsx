import { Stack } from 'expo-router';
import { AppShell } from '@/components/AppShell';

export default function AppLayout() {
  return (
    <AppShell>
      <Stack screenOptions={{ headerShown: false }} />
    </AppShell>
  );
}
