import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Appbar, List, Surface, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { addTripPlace, getPlaces } from '../../../src/db';
import type { Place } from '../../../src/db/types';

export default function AddTripPlaceScreen() {
  const { t } = useTranslation();
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
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('trips.addPlace')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {places.length === 0 ? (
          <Text>{t('trips.noPlacesAvailable')}</Text>
        ) : (
          <List.Section>
            {places.map((place) => (
              <List.Item
                key={place.id}
                title={place.name}
                description={place.description ?? t('common.noDescription')}
                onPress={() => handleAddPlace(place.id)}
                left={(props) => <List.Icon {...props} icon="plus-circle" />}
              />
            ))}
          </List.Section>
        )}
      </ScrollView>
    </Surface>
  );
}
