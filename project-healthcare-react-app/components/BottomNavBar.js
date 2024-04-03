// BottomNavBar.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';

export default function BottomNavBar() {
  return (
    <View style={styles.navContainer}>
      <Link href="/" style={styles.navLink}>Home</Link>
      <Link href="/PatientList" style={styles.navLink}>Patient List</Link>
      <Link href="/appointments" style={styles.navLink}>Appointments</Link>
      <Link href="/Profile" style={styles.navLink}>Account</Link>
      <Link href="/ContactPage" style={styles.navLink}>Contact Us</Link>
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
