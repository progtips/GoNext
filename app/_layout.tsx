import '../global.css';

import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { Asset } from 'expo-asset';

import { initDatabase } from '../src/db';

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(() => undefined);
  }, []);

  // Надёжнее для Web: получаем uri через expo-asset
  const bgUri = Asset.fromModule(
    require('../assets/backgrounds/gonext-bg.png')
  ).uri;

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.root}>
          {/* ФОН отдельным слоем */}
          <Image
            source={{ uri: bgUri }}
            resizeMode="cover"
            style={StyleSheet.absoluteFillObject}
          />

          {/* КОНТЕНТ поверх */}
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
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
