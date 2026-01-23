import { router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

export default function PlacesScreen() {
  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Места" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Список мест будет здесь.</Text>
        <Button mode="contained" onPress={() => router.push('/places/1')}>
          Открыть пример места
        </Button>
      </Surface>
    </Surface>
  );
}
