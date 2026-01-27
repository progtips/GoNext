import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Surface, Switch, Text } from 'react-native-paper';

import { useThemeController } from '../../src/theme/ThemeContext';

export default function SettingsScreen() {
  const { isDark, setIsDark } = useThemeController();

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Настройки" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>Темная тема</Text>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>
        <Text>Настройки будут добавлены в следующих версиях.</Text>
      </ScrollView>
    </Surface>
  );
}
