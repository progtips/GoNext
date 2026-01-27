import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { addTrip } from '../../src/db';

export default function NewTripScreen() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    await addTrip({
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
        <Appbar.Content title={t('trips.newTitle')} />
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
          {t('common.save')}
        </Button>
      </ScrollView>
    </Surface>
  );
}
