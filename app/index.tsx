import { ImageBackground, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/backgrounds/gonext-bg.png')}
      style={styles.background}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
