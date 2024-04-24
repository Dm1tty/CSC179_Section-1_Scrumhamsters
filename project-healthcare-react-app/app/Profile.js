import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, Switch, TouchableOpacity } from 'react-native';

export default function Profile() {
  const [isAvailableToday, setIsAvailableToday] = useState(false);

  const handleToggleSwitch = () => setIsAvailableToday(previousState => !previousState);

  // Placeholder for logout and upcoming availability functions
  const handleLogout = () => {
    console.log('Logout action');
    // Implement logout logic here
  };

  const navigateToUpcomingAvailability = () => {
    console.log('Navigate to Upcoming Availability');
    // Implement navigation logic here
  };

  return (
    <ScrollView style={styles.scrollView}>

      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={{ uri: 'https://via.placeholder.com/150' }} // Replace with actual image URL
          />
        </View>
        <Text style={styles.name}>John Doe</Text>

        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityText}>Today's Availability</Text>
          <Switch
            trackColor={{ false: "#ff6b6b", true: "#48dbfb" }}
            thumbColor={isAvailableToday ? "#ffffff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={isAvailableToday}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={navigateToUpcomingAvailability}>
            <Text style={styles.buttonText}>Upcoming Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom navigation bar placeholder */}
        <View style={styles.bottomNavBar}>
          <Text style={styles.navText}>Home</Text>
          <Text style={styles.navText}>Patient List</Text>
          <Text style={styles.navText}>Appointments</Text>
          <Text style={styles.navText}>Account</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#1EB6B9',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center', // Center children horizontally
    paddingTop: 20, // Add padding to the top to move the content down
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 80, // Increase the top margin to move the image up
    marginBottom: 20,
  },
  // ... rest of the styles remain unchanged

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#c8d6e5', // Adjust border color to match screenshot theme
    borderWidth: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#576574', // Adjust text color to match screenshot theme
    marginTop: 10,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50, // Adjust the padding as needed
    alignItems: 'center',
    marginBottom: 20,
  },
  availabilityText: {
    fontSize: 16,
    color: '#576574', // Adjust text color to match screenshot theme
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Distribute buttons evenly
  },
  button: {
    backgroundColor: '#48dbfb', // Button color taken from screenshot for the 'Upcoming Availability' button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#ff6b6b', // Button color taken from screenshot for the 'Logout' button
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: -252, // Adds 10 pixels of "padding" outside the bottom of the bar
    left: 0,
    right: 0,
    backgroundColor: '#c8d6e5',
    paddingVertical: 10,
},
  navText: {
    color: '#576574', // Adjust text color to match screenshot theme
    fontSize: 16,
  },
});
