import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function SettingsScreen() {
  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Настройки" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text>Настройки будут добавлены в следующих версиях.</Text>
      </ScrollView>
    </Surface>
  );
}
