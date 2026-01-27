import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="GoNext - дневник туриста" />
      </Appbar.Header>
      <View style={styles.center}>
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
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  header: {
    backgroundColor: 'transparent',
  },
  btn: {
    alignSelf: 'stretch',
  },
});
