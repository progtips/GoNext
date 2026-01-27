import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { getTripById, updateTrip } from '../../../src/db';

export default function EditTripScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripId = Number(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    if (Number.isNaN(tripId)) {
      return;
    }
    getTripById(tripId)
      .then((trip) => {
        if (!trip) {
          return;
        }
        setTitle(trip.title);
        setDescription(trip.description ?? '');
        setStartDate(trip.startDate ?? '');
        setEndDate(trip.endDate ?? '');
        setCurrent(trip.current);
      })
      .catch(() => undefined);
  }, [tripId]);

  const handleSave = async () => {
    if (Number.isNaN(tripId) || !title.trim()) {
      return;
    }
    await updateTrip(tripId, {
      title: title.trim(),
      description: description.trim() || undefined,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      current,
    });
    router.back();
  };

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={t('trips.editTitle')} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <TextInput label={t('trips.titleLabel')} value={title} onChangeText={setTitle} />
        <TextInput
          label={t('places.descriptionLabel')}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput label={t('trips.startDate')} value={startDate} onChangeText={setStartDate} />
        <TextInput label={t('trips.endDate')} value={endDate} onChangeText={setEndDate} />
        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>{t('trips.makeCurrent')}</Text>
          <Switch value={current} onValueChange={setCurrent} />
        </Surface>
        <Button mode="contained" onPress={handleSave}>
          {t('common.saveChanges')}
        </Button>
      </ScrollView>
    </Surface>
  );
}
