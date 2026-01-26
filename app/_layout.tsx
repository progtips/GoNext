import { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { initDatabase } from '../src/db';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <ImageBackground
          source={require('../assets/backgrounds/gonext-bg.png')}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          />
        </ImageBackground>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
