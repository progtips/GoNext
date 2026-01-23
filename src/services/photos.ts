import * as FileSystem from 'expo-file-system';

const photosDirectory = `${FileSystem.documentDirectory ?? ''}photos/`;

export const savePhotoAsync = async (sourceUri: string) => {
  if (!FileSystem.documentDirectory) {
    return sourceUri;
  }

  await FileSystem.makeDirectoryAsync(photosDirectory, { intermediates: true });
  const filename = `${Date.now()}.jpg`;
  const destination = `${photosDirectory}${filename}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  return destination;
};

export const deletePhotoAsync = async (uri: string) => {
  if (!FileSystem.documentDirectory) {
    return;
  }
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
};
