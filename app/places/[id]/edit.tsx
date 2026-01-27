import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { getPlaceById, updatePlace } from '../../../src/db';
import { getCurrentDd } from '../../../src/services/location';

export default function EditPlaceScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = Number(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitLater, setVisitLater] = useState(false);
  const [liked, setLiked] = useState(false);
  const [dd, setDd] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (Number.isNaN(placeId)) {
      return;
    }
    getPlaceById(placeId)
      .then((place) => {
        if (!place) {
          return;
        }
        setName(place.name);
        setDescription(place.description ?? '');
        setVisitLater(place.visitLater);
        setLiked(place.liked);
        setDd(place.dd ?? '');
      })
      .catch(() => undefined);
  }, [placeId]);

  const handleSave = async () => {
    if (Number.isNaN(placeId) || !name.trim()) {
      return;
    }
    await updatePlace(placeId, {
      name: name.trim(),
      description: description.trim() || undefined,
      visitLater,
      liked,
      dd: dd.trim() || null,
    });
    router.back();
  };

  const handleFillLocation = async () => {
    setLoadingLocation(true);
    const value = await getCurrentDd();
    if (value) {
      setDd(value);
    }
    setLoadingLocation(false);
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('places.editTitle')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <TextInput label={t('places.nameLabel')} value={name} onChangeText={setName} />
        <TextInput
          label={t('places.descriptionLabel')}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>{t('places.filters.visitLater')}</Text>
          <Switch value={visitLater} onValueChange={setVisitLater} />
        </Surface>
        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>{t('places.filters.liked')}</Text>
          <Switch value={liked} onValueChange={setLiked} />
        </Surface>

        <TextInput label={t('places.ddLabel')} value={dd} onChangeText={setDd} />
        <Button mode="outlined" onPress={handleFillLocation} loading={loadingLocation}>
          {t('places.fillCurrent')}
        </Button>

        <Button mode="contained" onPress={handleSave}>
          {t('common.saveChanges')}
        </Button>
      </ScrollView>
    </Surface>
  );
}
