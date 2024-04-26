// BottomNavBar.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';



export default function BottomNavBar() {

  return (
    <View style={styles.navContainer}>
      <Link href="/" style={styles.navLink}>Home</Link>
      <Link href="/Patients" style={styles.navLink}>Patients</Link>
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
    width: '100%', // Use the full width of the device
    padding: 10,
    position: 'absolute', // Position the navbar absolutely relative to its parent
    bottom: 0, // Anchor the navbar to the bottom
    left: 0, // Align it to the left side to ensure full width
  },
  navLink: {
    padding: 10,
  },
});
