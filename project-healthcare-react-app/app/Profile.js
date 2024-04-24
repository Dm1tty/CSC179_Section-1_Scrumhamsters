// Profile.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Switch, Button } from 'react-native';
import BottomNavBar from '../components/BottomNavBar'; 


export default function Profile() {
  const [isAvailableToday, setIsAvailableToday] = useState(false);
  const [profileData, setProfileData] = useState({});
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "doctors", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchProfileData();
  }, [auth.currentUser]);

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
            trackColor={{ false: "#ff6b6b", true: "#48dbfb" }}
            thumbColor={isAvailableToday ? "#ffffff" : "#f4f3f4"}
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
  scrollView: {
    flex: 1,
    backgroundColor: '#1EB6B9',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#fff',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#576574', // Adjust text color to match screenshot theme
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
