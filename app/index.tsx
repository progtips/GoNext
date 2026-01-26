import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text variant="titleLarge">GoNext</Text>
      </View>

      {/* Центр */}
      <View style={styles.center}>
        <Text variant="titleMedium">GoNext — дневник туриста</Text>

        <Button mode="contained" onPress={() => router.push('/places')} style={styles.btn}>
          Места
        </Button>

        <Button mode="contained" onPress={() => router.push('/trips')} style={styles.btn}>
          Поездки
        </Button>

        <Button mode="contained" onPress={() => router.push('/next')} style={styles.btn}>
          Следующее место
        </Button>

        <Button mode="contained" onPress={() => router.push('/settings')} style={styles.btn}>
          Настройки
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent', // важно, чтобы не перекрывать фон
  },
  header: {
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
    width: '100%',
    backgroundColor: 'transparent',
  },
  btn: {
    alignSelf: 'stretch',
  },
});
