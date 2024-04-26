import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Image, Switch, Button, TouchableOpacity } from 'react-native';

import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

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

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'signin' }],
      });
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const imageUri = result.assets[0].uri;
      uploadImageAndGetURL(imageUri).then((imageUrl) => {
        updateProfileImageUrl(imageUrl);
      }).catch((error) => {
        console.error("Error uploading image:", error);
      });
    }
  };

  const uploadImageAndGetURL = async (imageUri) => {
    try {
      const blob = await (await fetch(imageUri)).blob();
      const storageRef = ref(getStorage(), `profile_images/${auth.currentUser.uid}_${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      Alert.alert("Upload Successful", "Your image has been successfully uploaded.");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "There was an issue uploading your image.");
    }
  };

  const updateProfileImageUrl = async (imageUrl) => {
    try {
      const userDocRef = doc(db, "doctors", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        image: imageUrl,
      });
      setProfileData((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Update Failed", "Failed to update profile image.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.upperSection}>
        <Image
          style={styles.avatar}
          source={{ uri: profileData.image || 'https://via.placeholder.com/150' }}
        />
        <Text style={styles.name}>{profileData.firstName} {profileData.lastName}</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageUploadBtn}>
          <Text>Change Profile Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.options}>
        <View style={styles.optionItem}>
          <Text style={styles.optionText}>Available Today</Text>
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
          color="#FF6347"
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
    
  },
  upperSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginTop: 20,
    width: 150,
    height: 150,
    
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  options: {
    width: '100%',
    alignItems: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionText: {
    marginRight: 10,
  },
});
