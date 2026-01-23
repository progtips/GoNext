import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, List, Surface, Text } from 'react-native-paper';

import { getTripById, getTripPlaces, markTripPlaceVisited } from '../../src/db';
import type { Trip } from '../../src/db/types';

type TripPlaceRow = {
  id: number;
  placeId: number;
  orderIndex: number;
  visited: boolean;
  visitDate: string | null;
  placeName: string;
};

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripPlaces, setTripPlaces] = useState<TripPlaceRow[]>([]);

  const tripId = Number(id);

  const loadTrip = useCallback(() => {
    if (!Number.isNaN(tripId)) {
      getTripById(tripId).then(setTrip).catch(() => setTrip(null));
      getTripPlaces(tripId).then(setTripPlaces).catch(() => setTripPlaces([]));
    }
  }, [tripId]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  useFocusEffect(
    useCallback(() => {
      loadTrip();
    }, [loadTrip])
  );

  const handleMarkVisited = async (tripPlaceId: number) => {
    await markTripPlaceVisited(tripPlaceId);
    loadTrip();
  };

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={trip?.title ?? 'Поездка'} />
        <Appbar.Action
          icon="plus"
          onPress={() => router.push(`/trips/${tripId}/add-place`)}
        />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        {trip ? (
          <>
            <Text variant="titleMedium">{trip.title}</Text>
            <Text>{trip.description ?? 'Без описания'}</Text>
            <Text>
              Даты: {trip.startDate ?? '—'} — {trip.endDate ?? '—'}
            </Text>
          </>
        ) : (
          <Text>Поездка не найдена.</Text>
        )}

        <Surface elevation={0} style={{ marginTop: 8 }}>
          <Text variant="labelMedium">Маршрут</Text>
          {tripPlaces.length === 0 ? (
            <Surface elevation={0} style={{ gap: 8, marginTop: 8 }}>
              <Text>Маршрут пока пуст.</Text>
              <Button mode="contained" onPress={() => router.push(`/trips/${tripId}/add-place`)}>
                Добавить место
              </Button>
            </Surface>
          ) : (
            <List.Section>
              {tripPlaces.map((tp) => (
                <List.Item
                  key={tp.id}
                  title={`${tp.orderIndex}. ${tp.placeName}`}
                  description={tp.visited ? `Посещено: ${tp.visitDate ?? ''}` : 'Не посещено'}
                  onPress={() => (tp.visited ? undefined : handleMarkVisited(tp.id))}
                  left={(props) => <List.Icon {...props} icon={tp.visited ? 'check' : 'map-marker'} />}
                />
              ))}
            </List.Section>
          )}
        </Surface>
      </Surface>
    </Surface>
  );
}
