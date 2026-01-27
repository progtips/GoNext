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
  const [primaryColor, setPrimaryColor] = useState('#6750A4');

  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('gonext.theme'),
      AsyncStorage.getItem('gonext.primaryColor'),
    ])
      .then(([themeValue, colorValue]) => {
        if (themeValue === 'dark') {
          setIsDark(true);
        }
        if (colorValue) {
          setPrimaryColor(colorValue);
        }
      })
      .catch(() => undefined)
      .finally(() => setThemeReady(true));
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('gonext.theme', isDark ? 'dark' : 'light').catch(() => undefined);
  }, [isDark]);

  useEffect(() => {
    AsyncStorage.setItem('gonext.primaryColor', primaryColor).catch(() => undefined);
  }, [primaryColor]);

  const theme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: primaryColor,
        onPrimary: '#FFFFFF',
        primaryContainer: primaryColor,
        onPrimaryContainer: '#FFFFFF',
        secondary: primaryColor,
        onSecondary: '#FFFFFF',
        secondaryContainer: primaryColor,
        onSecondaryContainer: '#FFFFFF',
        background: 'transparent',
        surface: 'transparent',
      },
    };
  }, [isDark, primaryColor]);

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
        primaryColor,
        setPrimaryColor,
      }}
    >
      <PaperProvider theme={theme}>
        <SafeAreaProvider style={styles.safeArea}>
          <View style={styles.container}>
            {isDark ? (
              <View style={styles.darkBackground}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'none',
                    contentStyle: { backgroundColor: 'transparent' },
                  }}
                />
              </View>
            ) : (
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
            )}
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
  darkBackground: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
