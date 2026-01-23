import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Appbar, List, Surface, Text } from 'react-native-paper';

import { addTripPlace, getPlaces } from '../../../src/db';
import type { Place } from '../../../src/db/types';

export default function AddTripPlaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [places, setPlaces] = useState<Place[]>([]);
  const tripId = Number(id);

  const loadPlaces = useCallback(() => {
    getPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [loadPlaces])
  );

  const handleAddPlace = async (placeId: number) => {
    if (Number.isNaN(tripId)) {
      return;
    }
    await addTripPlace(tripId, placeId);
    router.back();
  };

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Добавить место" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16 }} elevation={0}>
        {places.length === 0 ? (
          <Text>Нет доступных мест. Сначала создайте место.</Text>
        ) : (
          <List.Section>
            {places.map((place) => (
              <List.Item
                key={place.id}
                title={place.name}
                description={place.description ?? 'Без описания'}
                onPress={() => handleAddPlace(place.id)}
                left={(props) => <List.Icon {...props} icon="plus-circle" />}
              />
            ))}
          </List.Section>
        )}
      </Surface>
    </Surface>
  );
}
