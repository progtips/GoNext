import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Surface, Text } from 'react-native-paper';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Поездка" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text>Детали поездки: {id}</Text>
      </ScrollView>
    </Surface>
  );
}
