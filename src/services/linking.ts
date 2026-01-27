import * as Linking from 'expo-linking';

export const openInMaps = (dd: string, label?: string) => {
  const encodedLabel = label ? encodeURIComponent(label) : 'Place';
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dd
  )}(${encodedLabel})`;
  return Linking.openURL(url);
};

export const openInNavigator = (dd: string) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dd)}`;
  return Linking.openURL(url);
};
