import { router } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function NextPlaceScreen() {
  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Следующее место" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Следующее место будет показано здесь.</Text>
      </Surface>
    </Surface>
  );
}
