import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

import { getNextTripPlace, markTripPlaceVisited } from '../../src/db';
import { openInMaps, openInNavigator } from '../../src/services/linking';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export default function NextPlaceScreen() {
  const [nextPlace, setNextPlace] = useState<null | {
    id: number;
    placeName: string;
    placeDescription: string | null;
    dd: string | null;
    visitDate: string | null;
    visited: boolean;
  }>(null);

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
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Следующее место" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {nextPlace ? (
          <>
            <Text variant="titleMedium">{nextPlace.placeName}</Text>
            <Text>{nextPlace.placeDescription ?? 'Без описания'}</Text>
            <Text>DD: {nextPlace.dd ?? '—'}</Text>
            {nextPlace.dd ? (
              <>
                <Button
                  mode="contained"
                  onPress={() => openInMaps(nextPlace.dd!, nextPlace.placeName)}
                >
                  Открыть на карте
                </Button>
                <Button mode="outlined" onPress={() => openInNavigator(nextPlace.dd!)}>
                  Открыть в навигаторе
                </Button>
              </>
            ) : null}
            {!nextPlace.visited ? (
              <Button mode="outlined" onPress={handleVisited}>
                Отметить посещенным
              </Button>
            ) : null}
          </>
        ) : (
          <Text>Нет следующего места. Проверьте текущую поездку.</Text>
        )}
      </ScrollView>
    </Surface>
  );
}
