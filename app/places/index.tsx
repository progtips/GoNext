import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Appbar, Button, List, Surface, Text } from 'react-native-paper';

import { getPlaces } from '../../src/db';
import type { Place } from '../../src/db/types';

export default function PlacesScreen() {
  const [places, setPlaces] = useState<Place[]>([]);

  const loadPlaces = useCallback(() => {
    getPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [loadPlaces])
  );

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Места" />
        <Appbar.Action icon="plus" onPress={() => router.push('/places/new')} />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16 }} elevation={0}>
        {places.length === 0 ? (
          <Surface elevation={0} style={{ gap: 12 }}>
            <Text>Пока нет мест. Добавьте первое место.</Text>
            <Button mode="contained" onPress={() => router.push('/places/new')}>
              Добавить место
            </Button>
          </Surface>
        ) : (
          <List.Section>
            {places.map((place) => (
              <List.Item
                key={place.id}
                title={place.name}
                description={place.description ?? 'Без описания'}
                onPress={() => router.push(`/places/${place.id}`)}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
            ))}
          </List.Section>
        )}
      </Surface>
    </Surface>
  );
}
