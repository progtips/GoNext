import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';

import { addTrip } from '../../src/db';

export default function NewTripScreen() {
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
        <Appbar.Content title="Новая поездка" />
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
          Сохранить
        </Button>
      </ScrollView>
    </Surface>
  );
}
