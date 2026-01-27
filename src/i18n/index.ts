import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

const STORAGE_KEY = 'gonext.language';

export const initI18n = async () => {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  const lng = saved ?? 'ru';

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
      },
      lng,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });
  } else {
    await i18n.changeLanguage(lng);
  }

  return lng;
};

export const setLanguage = async (lng: 'ru' | 'en') => {
  await AsyncStorage.setItem(STORAGE_KEY, lng);
  await i18n.changeLanguage(lng);
};

export default i18n;
