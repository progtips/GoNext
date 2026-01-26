import { View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function NextPlaceScreen() {
  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Следующее место" />
      </Appbar.Header>

      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text>Следующее место будет показано здесь.</Text>
      </View>
    </Surface>
  );
}
