import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, PaperProvider, Surface, Text } from 'react-native-paper';

import { initDatabase } from '../src/db';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    initDatabase()
      .then(() => {
        if (isMounted) {
          setReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <PaperProvider>
        <SafeAreaProvider>
          <Surface
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <ActivityIndicator />
            <Text>Подготовка базы данных…</Text>
          </Surface>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
