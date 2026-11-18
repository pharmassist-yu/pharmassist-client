import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { FontSizes } from '@/constants/typography';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PharmAssist</Text>
      <Text style={styles.subtitle}>İlaç Bilgi ve Takip Asistanı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginTop: 8,
  },
});
