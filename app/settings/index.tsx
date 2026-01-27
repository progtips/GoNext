import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text } from 'react-native-paper';

import { useThemeController } from '../../src/theme/ThemeContext';

export default function SettingsScreen() {
  const { isDark, setIsDark, primaryColor, setPrimaryColor } = useThemeController();

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
        <Text variant="labelMedium">Основной цвет</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[
            '#6750A4',
            '#4F378B',
            '#1E88E5',
            '#00897B',
            '#43A047',
            '#F4511E',
            '#E53935',
            '#3949AB',
          ].map((color) => (
            <Button
              key={color}
              mode={primaryColor === color ? 'contained' : 'outlined'}
              onPress={() => setPrimaryColor(color)}
              style={{ marginRight: 8 }}
            >
              {color}
            </Button>
          ))}
        </View>
      </ScrollView>
    </Surface>
  );
}
