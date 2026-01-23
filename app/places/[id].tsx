import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

import { getPlaceById } from '../../src/db';
import type { Place } from '../../src/db/types';
import { openInMaps } from '../../src/services/linking';

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);

  useEffect(() => {
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
      getPlaceById(numericId).then(setPlace).catch(() => setPlace(null));
    }
  }, [id]);

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={place?.name ?? 'Место'} />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        {place ? (
          <>
            <Text variant="titleMedium">{place.name}</Text>
            <Text>{place.description ?? 'Без описания'}</Text>
            <Text>Координаты: {place.latitude ?? '—'}, {place.longitude ?? '—'}</Text>
            <Text>В планах: {place.visitLater ? 'да' : 'нет'}</Text>
            <Text>Понравилось: {place.liked ? 'да' : 'нет'}</Text>
            {place.latitude != null && place.longitude != null ? (
              <Button
                mode="contained"
                onPress={() => openInMaps(place.latitude!, place.longitude!, place.name)}
              >
                Открыть на карте
              </Button>
            ) : null}
          </>
        ) : (
          <Text>Место не найдено.</Text>
        )}
      </Surface>
    </Surface>
  );
}
