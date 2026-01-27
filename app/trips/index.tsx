import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Appbar, Button, List, Surface, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { getTrips, setCurrentTrip } from '../../src/db';
import type { Trip } from '../../src/db/types';

export default function TripsScreen() {
  const { t } = useTranslation();
  const [trips, setTrips] = useState<Trip[]>([]);

  const loadTrips = useCallback(() => {
    getTrips().then(setTrips).catch(() => setTrips([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [loadTrips])
  );

  const handleSetCurrent = async (tripId: number) => {
    await setCurrentTrip(tripId);
    loadTrips();
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('trips.title')} />
        <Appbar.Action icon="plus" onPress={() => router.push('/trips/new')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {trips.length === 0 ? (
          <Surface elevation={0} style={{ gap: 12 }}>
            <Text>{t('trips.empty')}</Text>
            <Button mode="contained" onPress={() => router.push('/trips/new')}>
              {t('trips.createTrip')}
            </Button>
          </Surface>
        ) : (
          <>
            <List.Section>
              {trips.map((trip) => (
                <List.Item
                  key={trip.id}
                  title={trip.title}
                  description={trip.description ?? t('common.noDescription')}
                  onPress={() => router.push(`/trips/${trip.id}`)}
                  right={(props) =>
                    trip.current ? <List.Icon {...props} icon="check-circle" /> : null
                  }
                  left={(props) => <List.Icon {...props} icon="map" />}
                />
              ))}
            </List.Section>
            <Surface elevation={0} style={{ gap: 8 }}>
              <Text variant="labelMedium">{t('trips.setCurrent')}</Text>
              {trips.map((trip) => (
                <Button key={trip.id} mode="outlined" onPress={() => handleSetCurrent(trip.id)}>
                  {trip.title}
                </Button>
              ))}
            </Surface>
          </>
        )}
      </ScrollView>
    </Surface>
  );
}
