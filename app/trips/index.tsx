import { router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

export default function TripsScreen() {
  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Поездки" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Список поездок будет здесь.</Text>
        <Button mode="contained" onPress={() => router.push('/trips/1')}>
          Открыть пример поездки
        </Button>
      </Surface>
    </Surface>
  );
}
