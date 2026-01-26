import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';

import { addPlace } from '../../src/db';

export default function NewPlaceScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitLater, setVisitLater] = useState(true);
  const [liked, setLiked] = useState(false);
  const [dd, setDd] = useState('');

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

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Новое место" />
      </Appbar.Header>

      <View style={{ flex: 1, padding: 16, gap: 12 }}>
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

        <TextInput label="DD (Decimal Degrees)" value={dd} onChangeText={setDd} />

        <Button mode="contained" onPress={handleSave}>
          Сохранить
        </Button>
      </View>
    </Surface>
  );
}
