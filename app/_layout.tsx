import '../global.css';

import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <View style={styles.root}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'none',
            }}
          />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
});
