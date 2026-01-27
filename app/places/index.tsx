import { useCallback, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Appbar, Button, List, Surface, Switch, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { getPlaces } from '../../src/db';
import type { Place } from '../../src/db/types';

export default function PlacesScreen() {
  const { t } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [filterVisitLater, setFilterVisitLater] = useState(false);
  const [filterLiked, setFilterLiked] = useState(false);

  const loadPlaces = useCallback(() => {
    getPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [loadPlaces])
  );

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (filterVisitLater && !place.visitLater) {
        return false;
      }
      if (filterLiked && !place.liked) {
        return false;
      }
      return true;
    });
  }, [places, filterVisitLater, filterLiked]);

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('places.title')} />
        <Appbar.Action icon="plus" onPress={() => router.push('/places/new')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Surface elevation={0} style={{ gap: 8 }}>
          <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Switch value={filterVisitLater} onValueChange={setFilterVisitLater} />
            <Text>{t('places.filters.visitLater')}</Text>
          </Surface>
          <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Switch value={filterLiked} onValueChange={setFilterLiked} />
            <Text>{t('places.filters.liked')}</Text>
          </Surface>
        </Surface>

        {filteredPlaces.length === 0 ? (
          <Surface elevation={0} style={{ gap: 12 }}>
            <Text>{t('places.empty')}</Text>
            <Button mode="contained" onPress={() => router.push('/places/new')}>
              {t('places.addPlace')}
            </Button>
          </Surface>
        ) : (
          <List.Section>
            {filteredPlaces.map((place) => (
              <List.Item
                key={place.id}
                title={place.name}
                description={place.description ?? t('common.noDescription')}
                onPress={() => router.push(`/places/${place.id}`)}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
            ))}
          </List.Section>
        )}
      </ScrollView>
    </Surface>
  );
}
