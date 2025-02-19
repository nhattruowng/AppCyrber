// app/index.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AOnBoarding from '../screen/AOnBoarding';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Amazingym!</Text>
      <Button title="Go to Explore" onPress={() => {AOnBoarding}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
