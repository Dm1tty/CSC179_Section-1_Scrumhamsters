// Profile.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, Button } from 'react-native';
import BottomNavBar from '../components/BottomNavBar'; 


export default function Profile() {
  const [isAvailableToday, setIsAvailableToday] = useState(false);

  const handleToggleSwitch = () => setIsAvailableToday(previousState => !previousState);

  // Placeholder for logout function
  const handleLogout = () => {
    console.log('Logout action');
    // Implement logout logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <Image
          style={styles.avatar}
          source={{uri: 'https://via.placeholder.com/150'}} // Replace with actual image URL
        />
        <Text style={styles.name}>John Doe</Text> {/* Replace with actual name */}
      </View>
      
      <View style={styles.options}>
        <View style={styles.optionItem}>
          <Text>Today's Availability</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAvailableToday ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleSwitch}
            value={isAvailableToday}
          />
        </View>
        
        <Button
          title="Upcoming Availability"
          onPress={() => console.log('Navigate to Upcoming Availability')}
          // Implement navigation to Upcoming Availability page
        />

        <Button
          title="Logout"
          onPress={handleLogout}
          color="#FF6347"
        />
      </View>
      <BottomNavBar />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  upperSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  options: {
    width: '80%',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});
