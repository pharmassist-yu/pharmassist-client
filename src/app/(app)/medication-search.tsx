import { ScrollView, StyleSheet, View } from 'react-native';
import { PlaceholderCard } from '@/components/PlaceholderCard';
import { ScreenHeader } from '@/components/ScreenHeader';

export default function MedicationSearchScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <ScreenHeader
          title="İlaç Arama"
          subtitle="İlaç adı veya etken maddeye göre arama bu ekranda yapılacaktır."
          showBack
          backFallback="/home"
          hideBackOnDesktop
        />

        <PlaceholderCard
          icon="search-outline"
          title="İlaç Arama Yer Tutucu"
          description="Arama çubuğu, prospektüs özetleri ve muadil ilaç listesi iş mantığı eklendiğinde burada görüntülenecektir."
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
