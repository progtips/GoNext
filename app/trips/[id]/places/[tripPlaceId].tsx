import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Appbar, Button, Surface, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import {
  addTripPlacePhoto,
  deleteTripPlacePhoto,
  getTripPlaceById,
  getTripPlacePhotos,
  markTripPlaceVisited,
  updateTripPlaceNotes,
} from '../../../../src/db';
import type { TripPlacePhoto } from '../../../../src/db/types';
import { openInMaps } from '../../../../src/services/linking';
import { deletePhotoAsync, savePhotoAsync } from '../../../../src/services/photos';

export default function TripPlaceDetailsScreen() {
  const { t } = useTranslation();
  const { tripPlaceId } = useLocalSearchParams<{ tripPlaceId: string }>();
  const [details, setDetails] = useState<null | {
    id: number;
    placeName: string;
    placeDescription: string | null;
    dd: string | null;
    visited: boolean;
    visitDate: string | null;
    notes: string | null;
  }>(null);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<TripPlacePhoto[]>([]);

  const tripPlaceNumericId = Number(tripPlaceId);

  const loadDetails = async () => {
    if (Number.isNaN(tripPlaceNumericId)) {
      setDetails(null);
      setPhotos([]);
      return;
    }
    const [tripPlaceDetails, tripPhotos] = await Promise.all([
      getTripPlaceById(tripPlaceNumericId),
      getTripPlacePhotos(tripPlaceNumericId),
    ]);
    if (tripPlaceDetails) {
      setDetails(tripPlaceDetails);
      setNotes(tripPlaceDetails.notes ?? '');
    } else {
      setDetails(null);
      setNotes('');
    }
    setPhotos(tripPhotos);
  };

  useEffect(() => {
    loadDetails().catch(() => undefined);
  }, [tripPlaceNumericId]);

  const handleSaveNotes = async () => {
    if (Number.isNaN(tripPlaceNumericId)) {
      return;
    }
    await updateTripPlaceNotes(tripPlaceNumericId, notes.trim() || null);
    loadDetails().catch(() => undefined);
  };

  const handleMarkVisited = async () => {
    if (Number.isNaN(tripPlaceNumericId)) {
      return;
    }
    await markTripPlaceVisited(tripPlaceNumericId);
    loadDetails().catch(() => undefined);
  };

  const handleAddPhoto = async () => {
    if (Number.isNaN(tripPlaceNumericId)) {
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
    await addTripPlacePhoto(tripPlaceNumericId, savedUri);
    loadDetails().catch(() => undefined);
  };

  const handleDeletePhoto = (photo: TripPlacePhoto) => {
    Alert.alert(t('places.deletePhotoTitle'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteTripPlacePhoto(photo.id);
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
        <Appbar.Content title={details?.placeName ?? t('tripPlace.title')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {details ? (
          <>
            <Text variant="titleMedium">{details.placeName}</Text>
            <Text>{details.placeDescription ?? t('common.noDescription')}</Text>
            <Text>DD: {details.dd ?? '—'}</Text>
            <Text>
              {t('tripPlace.visitedLabel')}: {details.visited ? t('common.yes') : t('common.no')}
            </Text>
            {details.visitDate ? (
              <Text>
                {t('tripPlace.visitDateLabel')}: {details.visitDate}
              </Text>
            ) : null}
            {details.dd ? (
              <Button mode="contained" onPress={() => openInMaps(details.dd!, details.placeName)}>
                {t('common.openMap')}
              </Button>
            ) : null}
            {!details.visited ? (
              <Button mode="outlined" onPress={handleMarkVisited}>
                {t('common.markVisited')}
              </Button>
            ) : null}
          </>
        ) : (
          <Text>{t('places.detailsNotFound')}</Text>
        )}

        <Surface elevation={0} style={{ gap: 12, backgroundColor: 'transparent' }}>
          <Text variant="labelMedium">{t('tripPlace.notes')}</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder={t('tripPlace.notesPlaceholder')}
          />
          <Button mode="contained" onPress={handleSaveNotes}>
            {t('tripPlace.saveNotes')}
          </Button>
        </Surface>

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
