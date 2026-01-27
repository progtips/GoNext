import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';

import { getTripById, updateTrip } from '../../../src/db';

export default function EditTripScreen() {
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
        <Appbar.Content title="Редактировать поездку" />
      </Appbar.Header>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <TextInput label="Название" value={title} onChangeText={setTitle} />
        <TextInput
          label="Описание"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput label="Дата начала" value={startDate} onChangeText={setStartDate} />
        <TextInput label="Дата окончания" value={endDate} onChangeText={setEndDate} />
        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>Сделать текущей</Text>
          <Switch value={current} onValueChange={setCurrent} />
        </Surface>
        <Button mode="contained" onPress={handleSave}>
          Сохранить изменения
        </Button>
      </ScrollView>
    </Surface>
  );
}
