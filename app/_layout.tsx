import '../global.css';

import { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
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

const bg = require('../assets/backgrounds/gonext-bg.png');

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider style={styles.safeArea}>
        <View style={styles.root}>
          {/* ФОН отдельным слоем */}
          <ImageBackground
            source={bg}
            resizeMode="cover"
            style={styles.bg}
            imageStyle={styles.bgImage}
          />

          {/* КОНТЕНТ поверх */}
          <View style={styles.content} pointerEvents="auto">
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
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
    position: 'relative', // важно для web
  },

  // Абсолютный фон на весь экран
  bg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    // если захочешь "якорь" сверху на web — сделаем отдельно через Platform
  },

  content: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
});
