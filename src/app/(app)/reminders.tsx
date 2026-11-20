import { ScrollView, StyleSheet, View } from 'react-native';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function RemindersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <ScreenHeader
          title="Hatırlatıcılar"
          subtitle="Yaklaşan ilaç hatırlatıcıları ve doz saatleri burada yönetilecektir."
          showBack
          backFallback="/home"
        />

        <PlaceholderCard
          icon="notifications-outline"
          title="Hatırlatıcılar Yer Tutucu"
          description="İlaç alma saatleri, bildirim planlaması ve onay kayıtları sonraki aşamada bu ekrana eklenecektir."
        />
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
});
