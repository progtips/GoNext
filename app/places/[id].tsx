import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Место" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Карточка места: {id}</Text>
      </Surface>
    </Surface>
  );
}
