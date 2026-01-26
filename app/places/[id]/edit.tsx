import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Appbar, Button, Surface, Switch, Text, TextInput } from 'react-native-paper';

import { getPlaceById, updatePlace } from '../../../src/db';

export default function EditPlaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = Number(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitLater, setVisitLater] = useState(false);
  const [liked, setLiked] = useState(false);
  const [dd, setDd] = useState('');

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

  return (
    <Surface style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Редактировать место" />
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
          Сохранить изменения
        </Button>
      </View>
    </Surface>
  );
}
