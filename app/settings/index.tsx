import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { useThemeController } from '../../src/theme/ThemeContext';
import { setLanguage } from '../../src/i18n';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { isDark, setIsDark, primaryColor, setPrimaryColor } = useThemeController();

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('settings.title')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>{t('settings.darkTheme')}</Text>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>
        <Text variant="labelMedium">{t('settings.primaryColor')}</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          {[
            '#6750A4',
            '#4F378B',
            '#1E88E5',
            '#00897B',
            '#43A047',
            '#F4511E',
            '#E53935',
            '#3949AB',
            '#8E24AA',
            '#6D4C41',
          ].map((color) => (
            <Pressable
              key={color}
              onPress={() => setPrimaryColor(color)}
              accessibilityRole="button"
              accessibilityLabel={t('settings.selectColor', { color })}
              hitSlop={8}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: color,
                borderWidth: primaryColor === color ? 3 : 1,
                borderColor: primaryColor === color ? '#FFFFFF' : 'rgba(0, 0, 0, 0.2)',
              }}
            />
          ))}
        </View>
        <Text variant="labelMedium">{t('settings.language')}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            mode={i18n.language === 'ru' ? 'contained' : 'outlined'}
            onPress={() => setLanguage('ru')}
          >
            {t('settings.languageRu')}
          </Button>
          <Button
            mode={i18n.language === 'en' ? 'contained' : 'outlined'}
            onPress={() => setLanguage('en')}
          >
            {t('settings.languageEn')}
          </Button>
        </View>
      </ScrollView>
    </Surface>
  );
}
