import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

import { getNextTripPlace, markTripPlaceVisited } from '../../src/db';
import { openInMaps } from '../../src/services/linking';

type NextPlace = {
  id: number;
  tripId: number;
  placeId: number;
  orderIndex: number;
  visited: boolean;
  visitDate: string | null;
  placeName: string;
  placeDescription: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function NextPlaceScreen() {
  const [nextPlace, setNextPlace] = useState<NextPlace | null>(null);

  const loadNext = useCallback(() => {
    getNextTripPlace().then(setNextPlace).catch(() => setNextPlace(null));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNext();
    }, [loadNext])
  );

  const handleVisited = async () => {
    if (!nextPlace) {
      return;
    }
    await markTripPlaceVisited(nextPlace.id);
    loadNext();
  };

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Следующее место" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        {nextPlace ? (
          <>
            <Text variant="titleMedium">{nextPlace.placeName}</Text>
            <Text>{nextPlace.placeDescription ?? 'Без описания'}</Text>
            <Text>
              Координаты: {nextPlace.latitude ?? '—'}, {nextPlace.longitude ?? '—'}
            </Text>
            {nextPlace.latitude != null && nextPlace.longitude != null ? (
              <Button
                mode="contained"
                onPress={() =>
                  openInMaps(nextPlace.latitude!, nextPlace.longitude!, nextPlace.placeName)
                }
              >
                Открыть на карте
              </Button>
            ) : null}
            <Button mode="outlined" onPress={handleVisited}>
              Отметить посещенным
            </Button>
          </>
        ) : (
          <Text>Нет следующего места. Проверьте текущую поездку.</Text>
        )}
      </Surface>
    </Surface>
  );
}
