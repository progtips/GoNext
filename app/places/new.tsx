import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { addPlace } from '../../src/db';
import { getCurrentDd } from '../../src/services/location';

export default function NewPlaceScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitLater, setVisitLater] = useState(true);
  const [liked, setLiked] = useState(false);
  const [dd, setDd] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    await addPlace({
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
        <Appbar.Content title={t('places.newTitle')} />
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
          {t('common.save')}
        </Button>
      </ScrollView>
    </Surface>
  );
}
