import '../global.css';

import { useEffect, useMemo, useState } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initDatabase } from '../src/db';
import ThemeContext from '../src/theme/ThemeContext';

export default function RootLayout() {
  const [isDark, setIsDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('gonext.theme')
      .then((value) => {
        if (value === 'dark') {
          setIsDark(true);
        }
      })
      .catch(() => undefined)
      .finally(() => setThemeReady(true));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('gonext.theme', isDark ? 'dark' : 'light').catch(() => undefined);
  }, [isDark]);

  const theme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: 'transparent',
        surface: 'transparent',
      },
    };
  }, [isDark]);

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

  if (!themeReady) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        toggleTheme: () => setIsDark((prev) => !prev),
      }}
    >
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
    </ThemeContext.Provider>
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
