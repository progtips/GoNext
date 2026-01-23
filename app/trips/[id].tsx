import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Поездка" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <Text>Детали поездки: {id}</Text>
      </Surface>
    </Surface>
  );
}
