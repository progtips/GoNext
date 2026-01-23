import { useState } from 'react';
import { Appbar, Button, Snackbar, Surface, Text } from 'react-native-paper';

export default function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <Surface style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="GoNext" />
      </Appbar.Header>

      <Surface
        elevation={0}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          gap: 12,
        }}
      >
        <Text variant="titleMedium">Привет, React Native Paper!</Text>
        <Button mode="contained" onPress={() => setVisible(true)}>
          Нажми меня
        </Button>
      </Surface>

      <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
        Кнопка нажата
      </Snackbar>
    </Surface>
  );
}
