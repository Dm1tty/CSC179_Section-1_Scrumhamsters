// Profile.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, Button } from 'react-native';
import BottomNavBar from '../components/BottomNavBar'; 
import { getAuth} from "firebase/auth";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation



export default function Profile() {
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const auth = getAuth();
  const handleToggleSwitch = () => setIsAvailableToday(previousState => !previousState);
  const navigation = useNavigation(); // Use the useNavigation hook

  // Placeholder for logout function
  const handleLogout = () => {
    console.log('Logout action');
    auth.signOut().then(() => {
      // Sign-out successful.
      console.log("User signed out successfully.");
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }], // Use the name of your sign-in screen
      });
      
    }).catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <Image
          style={styles.avatar}
          source={{uri: 'https://via.placeholder.com/150'}} // Replace with actual image URL
        />
        <Text style={styles.name}>John Doe</Text>
      </View>
      
      <View style={styles.options}>
        <View style={styles.optionItem}>
        <Text style={styles.name}>Available Today</Text>
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
