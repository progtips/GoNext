import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, IconButton, List, Surface, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import {
  deleteTrip,
  deleteTripPlace,
  getTripById,
  getTripPlaces,
  markTripPlaceVisited,
  swapTripPlaceOrder,
} from '../../src/db';
import type { Trip } from '../../src/db/types';

export default function TripDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripPlaces, setTripPlaces] = useState<
    Array<{
      id: number;
      placeId: number;
      orderIndex: number;
      visited: boolean;
      visitDate: string | null;
      placeName: string;
      notes: string | null;
    }>
  >([]);

  const loadTrip = useCallback(() => {
    if (Number.isNaN(tripId)) {
      setTrip(null);
      setTripPlaces([]);
      return;
    }
    getTripById(tripId).then(setTrip).catch(() => setTrip(null));
    getTripPlaces(tripId).then(setTripPlaces).catch(() => setTripPlaces([]));
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

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = tripPlaces[index];
    const neighbor = tripPlaces[targetIndex];
    if (!current || !neighbor) {
      return;
    }
    await swapTripPlaceOrder(current.id, current.orderIndex, neighbor.id, neighbor.orderIndex);
    loadTrip();
  };

  const handleDeleteTripPlace = (tripPlaceId: number) => {
    Alert.alert(t('trips.deleteTripPlaceTitle'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteTripPlace(tripPlaceId);
          loadTrip();
        },
      },
    ]);
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={trip?.title ?? t('trips.title')} />
        <Appbar.Action
          icon="plus"
          onPress={() => router.push(`/trips/${tripId}/add-place`)}
        />
        <Appbar.Action
          icon="pencil"
          onPress={() => router.push(`/trips/${tripId}/edit`)}
        />
        <Appbar.Action
          icon="delete"
          onPress={() => {
            if (Number.isNaN(tripId)) {
              return;
            }
            Alert.alert(t('trips.deleteTripTitle'), t('trips.deleteTripBody'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: async () => {
                  await deleteTrip(tripId);
                  router.back();
                },
              },
            ]);
          }}
        />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {trip ? (
          <>
            <Text variant="titleMedium">{trip.title}</Text>
            <Text>{trip.description ?? t('common.noDescription')}</Text>
            <Text>{t('trips.dates', { start: trip.startDate ?? '—', end: trip.endDate ?? '—' })}</Text>
          </>
        ) : (
          <Text>{t('trips.detailsNotFound')}</Text>
        )}

        <Surface elevation={0} style={{ gap: 12, backgroundColor: 'transparent' }}>
          <Text variant="labelMedium">{t('trips.route')}</Text>
          {tripPlaces.length === 0 ? (
            <Surface elevation={0} style={{ gap: 8 }}>
              <Text>{t('trips.routeEmpty')}</Text>
              <Button mode="contained" onPress={() => router.push(`/trips/${tripId}/add-place`)}>
                {t('trips.addPlace')}
              </Button>
            </Surface>
          ) : (
            <List.Section>
              {tripPlaces.map((tp, index) => (
                <List.Item
                  key={tp.id}
                  title={`${tp.orderIndex}. ${tp.placeName}`}
                  description={
                    tp.visited
                      ? t('trips.visitedAt', { date: tp.visitDate ?? '' })
                      : tp.notes
                      ? t('trips.hasNotes')
                      : t('trips.notVisited')
                  }
                  onPress={() => router.push(`/trips/${tripId}/places/${tp.id}`)}
                  left={(props) => <List.Icon {...props} icon={tp.visited ? 'check' : 'map-marker'} />}
                  right={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <IconButton icon="arrow-up" onPress={() => handleMove(index, 'up')} />
                      <IconButton icon="arrow-down" onPress={() => handleMove(index, 'down')} />
                      <IconButton icon="delete" onPress={() => handleDeleteTripPlace(tp.id)} />
                      {!tp.visited ? (
                        <IconButton icon="check" onPress={() => handleMarkVisited(tp.id)} />
                      ) : null}
                    </View>
                  )}
                />
              ))}
            </List.Section>
          )}
        </Surface>
      </ScrollView>
    </Surface>
  );
}
