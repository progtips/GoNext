import { View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 12,
          width: '100%',
        }}
      >
        <Text variant="titleMedium">GoNext — дневник туриста</Text>
        <Button
          mode="contained"
          onPress={() => router.push('/places')}
          style={{ alignSelf: 'stretch' }}
        >
          Места
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push('/trips')}
          style={{ alignSelf: 'stretch' }}
        >
          Поездки
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push('/next')}
          style={{ alignSelf: 'stretch' }}
        >
          Следующее место
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push('/settings')}
          style={{ alignSelf: 'stretch' }}
        >
          Настройки
        </Button>
      </View>
    </View>
  );
}
