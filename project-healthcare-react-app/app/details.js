// DetailsPage.js
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function DetailsPage() {
  return (
    <View style={styles.container}>
      <Text>Details Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});