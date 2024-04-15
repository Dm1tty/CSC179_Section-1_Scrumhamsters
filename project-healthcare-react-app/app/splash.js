
/*      <Image source={require('splash.png')} style={styles.logo} />
*/
import React from 'react';
import { StatusBar, StyleSheet, Text, View, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('icon.png')} style={styles.logo} />
      <StatusBar backgroundColor="#4db6ac" barStyle="light-content" />
      <Text style={styles.title}>Patient Diary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4db6ac',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // You'll need to adjust the size to match the screenshot
    width: 100,
    height: 100,
    // Add any additional styling to match the screenshot, such as color if the image is transparent
  },
  title: {
    marginTop: 20, // Adjust the spacing as needed
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
    color: 'white', // Adjust the color to match the screenshot
  },
});

export default SplashScreen;
