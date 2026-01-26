import '../global.css';

import { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, View, ImageBackground } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Asset } from 'expo-asset';

import { initDatabase } from '../src/db';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'transparent',
    surface: 'transparent',
  },
};

const bgModule = require('../assets/backgrounds/gonext-bg.png');

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  // На web uri может содержать query (?unstable_path=...), поэтому важно url("...") с кавычками
  const bgUri = useMemo(() => Asset.fromModule(bgModule).uri, []);

  const webBgStyle = useMemo(
    () =>
      ({
        backgroundImage: `url("${bgUri}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }) as any,
    [bgUri]
  );

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View style={styles.root}>
          {/* ФОН */}
          {Platform.OS === 'web' ? (
            <View style={[StyleSheet.absoluteFillObject, webBgStyle]} />
          ) : (
            <ImageBackground
              source={bgModule}
              resizeMode="cover"
              style={StyleSheet.absoluteFillObject}
            />
          )}

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
