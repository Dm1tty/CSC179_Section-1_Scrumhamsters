// BottomNavBar.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function BottomNavBar() {
  return (
    <View style={styles.navContainer}>
      <Link href="/" style={styles.navLink}>Home</Link>
      <Link href="/appointments" style={styles.navLink}>Appointments</Link>
      <Link href="/settings" style={styles.navLink}>Settings</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ddd',
    padding: 10,
  },
  navLink: {
    padding: 10,
  },
});
