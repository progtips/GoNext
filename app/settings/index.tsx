import { router } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function SettingsScreen() {
  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Настройки" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Настройки будут добавлены в следующих версиях.</Text>
      </Surface>
    </Surface>
  );
}
