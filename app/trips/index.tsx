import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

export default function TripsScreen() {
  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Поездки" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text>Список поездок будет здесь.</Text>
        <Button mode="contained" onPress={() => router.push('/trips/1')}>
          Открыть пример поездки
        </Button>
      </ScrollView>
    </Surface>
  );
}
