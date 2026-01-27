import '../global.css';

import { useEffect } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

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

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const root = document.getElementById('root');
    let el: Element | null = root;

    // Прозрачним root и несколько первых вложенных контейнеров,
    // чтобы они не перекрывали CSS-фон.
    for (let i = 0; i < 8 && el; i++) {
      if (el instanceof HTMLElement) {
        el.style.background = 'transparent';
        el.style.backgroundColor = 'transparent';
      }
      el = el.firstElementChild;
    }
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider style={styles.safeArea}>
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/backgrounds/gonext-bg.png')}
            style={styles.background}
            resizeMode="cover"
          >
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'none',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
          </ImageBackground>
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
});
