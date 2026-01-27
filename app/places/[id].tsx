import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Appbar, Button, Surface, Text } from 'react-native-paper';

import { addPlacePhoto, deletePlace, deletePlacePhoto, getPlaceById, getPlacePhotos } from '../../src/db';
import type { Place, PlacePhoto } from '../../src/db/types';
import { openInMaps } from '../../src/services/linking';
import { deletePhotoAsync, savePhotoAsync } from '../../src/services/photos';

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);

  const placeId = Number(id);

  const loadDetails = async () => {
    if (Number.isNaN(placeId)) {
      setPlace(null);
      setPhotos([]);
      return;
    }
    const [placeData, photoRows] = await Promise.all([
      getPlaceById(placeId),
      getPlacePhotos(placeId),
    ]);
    setPlace(placeData);
    setPhotos(photoRows);
  };

  useEffect(() => {
    loadDetails().catch(() => undefined);
  }, [placeId]);

  const handleAddPhoto = async () => {
    if (Number.isNaN(placeId)) {
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) {
      return;
    }
    const savedUri = await savePhotoAsync(result.assets[0].uri);
    await addPlacePhoto(placeId, savedUri);
    loadDetails().catch(() => undefined);
  };

  const handleDeletePlace = () => {
    if (Number.isNaN(placeId)) {
      return;
    }
    Alert.alert('Удалить место?', 'Все фотографии будут удалены.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deletePlace(placeId);
          router.back();
        },
      },
    ]);
  };

  const handleDeletePhoto = (photo: PlacePhoto) => {
    Alert.alert('Удалить фото?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deletePlacePhoto(photo.id);
          await deletePhotoAsync(photo.uri);
          loadDetails().catch(() => undefined);
        },
      },
    ]);
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={place?.name ?? 'Место'} />
        {place ? (
          <>
            <Appbar.Action icon="pencil" onPress={() => router.push(`/places/${placeId}/edit`)} />
            <Appbar.Action icon="delete" onPress={handleDeletePlace} />
          </>
        ) : null}
      </Appbar.Header>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        showsVerticalScrollIndicator
      >
        {place ? (
          <>
            <Text variant="titleMedium">{place.name}</Text>
            <Text>{place.description ?? 'Без описания'}</Text>
            <Text>DD: {place.dd ?? '—'}</Text>
            <Text>В планах: {place.visitLater ? 'да' : 'нет'}</Text>
            <Text>Понравилось: {place.liked ? 'да' : 'нет'}</Text>
            {place.dd ? (
              <Button mode="contained" onPress={() => openInMaps(place.dd, place.name)}>
                Открыть на карте
              </Button>
            ) : null}
          </>
        ) : (
          <Text>Место не найдено.</Text>
        )}

        <Surface elevation={0} style={{ gap: 12, backgroundColor: 'transparent' }}>
          <Text variant="labelMedium">Фотографии</Text>
          <Button mode="outlined" onPress={handleAddPhoto}>
            Добавить фото
          </Button>
          {photos.length === 0 ? (
            <Text>Фотографий пока нет.</Text>
          ) : (
            photos.map((photo) => (
              <Surface key={photo.id} elevation={0} style={{ gap: 8 }}>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: '100%', height: 180, borderRadius: 12 }}
                  resizeMode="cover"
                />
                <Button mode="outlined" onPress={() => handleDeletePhoto(photo)}>
                  Удалить фото
                </Button>
              </Surface>
            ))
          )}
        </Surface>
      </ScrollView>
    </Surface>
  );
}
