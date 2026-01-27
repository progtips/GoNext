import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Appbar, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.screen}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title={t('app.titleTagline')} />
      </Appbar.Header>
      <View style={styles.center}>
        <Button mode="contained" onPress={() => router.push('/places')} style={styles.btn}>
          {t('home.places')}
        </Button>
        <Button mode="contained" onPress={() => router.push('/trips')} style={styles.btn}>
          {t('home.trips')}
        </Button>
        <Button mode="contained" onPress={() => router.push('/next')} style={styles.btn}>
          {t('home.nextPlace')}
        </Button>
        <Button mode="contained" onPress={() => router.push('/settings')} style={styles.btn}>
          {t('home.settings')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  header: {
    backgroundColor: 'transparent',
  },
  btn: {
    alignSelf: 'stretch',
  },
});
