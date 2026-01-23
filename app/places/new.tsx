import { useState } from 'react';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';

import { addPlace } from '../../src/db';
import { getCurrentPosition } from '../../src/services/location';

export default function NewPlaceScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitLater, setVisitLater] = useState(true);
  const [liked, setLiked] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    await addPlace({
      name: name.trim(),
      description: description.trim() || undefined,
      visitLater,
      liked,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    });
    router.back();
  };

  const handleFillLocation = async () => {
    const position = await getCurrentPosition();
    if (position) {
      setLatitude(String(position.latitude));
      setLongitude(String(position.longitude));
    }
  };

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Новое место" />
      </Appbar.Header>

      <Surface style={{ flex: 1, padding: 16, gap: 12 }} elevation={0}>
        <TextInput label="Название" value={name} onChangeText={setName} />
        <TextInput
          label="Описание"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>Хочу посетить</Text>
          <Switch value={visitLater} onValueChange={setVisitLater} />
        </Surface>
        <Surface elevation={0} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text>Понравилось</Text>
          <Switch value={liked} onValueChange={setLiked} />
        </Surface>
        <TextInput
          label="Широта"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          label="Долгота"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <Button mode="outlined" onPress={handleFillLocation}>
          Заполнить текущими координатами
        </Button>
        <Button mode="contained" onPress={handleSave}>
          Сохранить
        </Button>
      </Surface>
    </Surface>
  );
}
