import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Appbar, Button, Surface, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { addPlacePhoto, deletePlace, deletePlacePhoto, getPlaceById, getPlacePhotos } from '../../src/db';
import type { Place, PlacePhoto } from '../../src/db/types';
import { openInMaps } from '../../src/services/linking';
import { deletePhotoAsync, savePhotoAsync } from '../../src/services/photos';

export default function PlaceDetailsScreen() {
  const { t } = useTranslation();
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
    Alert.alert(t('places.deletePlaceTitle'), t('places.deletePlaceBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deletePlace(placeId);
          router.back();
        },
      },
    ]);
  };

  const handleDeletePhoto = (photo: PlacePhoto) => {
    Alert.alert(t('places.deletePhotoTitle'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
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
        <Appbar.Content title={place?.name ?? t('places.title')} />
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
            <Text>{place.description ?? t('common.noDescription')}</Text>
            <Text>DD: {place.dd ?? '—'}</Text>
            <Text>
              {t('places.visitLaterLabel')}: {place.visitLater ? t('common.yes') : t('common.no')}
            </Text>
            <Text>
              {t('places.likedLabel')}: {place.liked ? t('common.yes') : t('common.no')}
            </Text>
            {place.dd ? (
              <Button mode="contained" onPress={() => openInMaps(place.dd, place.name)}>
                {t('common.openMap')}
              </Button>
            ) : null}
          </>
        ) : (
          <Text>{t('places.detailsNotFound')}</Text>
        )}

        <Surface elevation={0} style={{ gap: 12, backgroundColor: 'transparent' }}>
          <Text variant="labelMedium">{t('places.photos')}</Text>
          <Button mode="outlined" onPress={handleAddPhoto}>
            {t('common.addPhoto')}
          </Button>
          {photos.length === 0 ? (
            <Text>{t('places.noPhotos')}</Text>
          ) : (
            photos.map((photo) => (
              <Surface key={photo.id} elevation={0} style={{ gap: 8 }}>
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: '100%', height: 180, borderRadius: 12 }}
                  resizeMode="cover"
                />
                <Button mode="outlined" onPress={() => handleDeletePhoto(photo)}>
                  {t('common.deletePhoto')}
                </Button>
              </Surface>
            ))
          )}
        </Surface>
      </ScrollView>
    </Surface>
  );
}
