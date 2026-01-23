import * as Linking from 'expo-linking';

export const openInMaps = (latitude: number, longitude: number, label?: string) => {
  const encodedLabel = label ? encodeURIComponent(label) : 'Place';
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}(${encodedLabel})`;
  return Linking.openURL(url);
};
