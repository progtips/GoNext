import * as Location from 'expo-location';

export const requestForegroundLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
};

export const getCurrentPosition = async () => {
  const hasPermission = await requestForegroundLocation();
  if (!hasPermission) {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({});
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
};
