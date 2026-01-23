import { router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

export default function Home() {
  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <Surface
        elevation={0}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 12,
        }}
      >
        <Text variant="titleMedium">GoNext — дневник туриста</Text>
        <Button mode="contained" onPress={() => router.push('/places')}>
          Места
        </Button>
        <Button mode="contained" onPress={() => router.push('/trips')}>
          Поездки
        </Button>
        <Button mode="contained" onPress={() => router.push('/next')}>
          Следующее место
        </Button>
        <Button mode="contained" onPress={() => router.push('/settings')}>
          Настройки
        </Button>
      </Surface>
    </Surface>
  );
}
