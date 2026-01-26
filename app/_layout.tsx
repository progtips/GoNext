import '../global.css';

import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Image } from 'expo-image';

import bg from '../assets/backgrounds/gonext-bg.png';
import { initDatabase } from '../src/db';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'transparent',
    surface: 'transparent',
  },
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View style={styles.root}>
          {/* ФОН */}
          <Image
            source={bg}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            // На web фиксируем "якорь" сверху, на мобиле можно оставить center
            contentPosition={Platform.OS === 'web' ? 'top' : 'center'}
            pointerEvents="none"
          />

          {/* КОНТЕНТ */}
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'none',
              }}
            />
          </View>
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, backgroundColor: 'transparent' },
});
