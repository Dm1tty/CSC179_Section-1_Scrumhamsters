import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const CreatePatientScreen = ({ }) => {

  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [rhFactor, setRhFactor] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [ageFormat, setAgeFormat] = useState('');
  const [phoneResidence, setPhoneResidence] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [assignedDoctorId, setAssignedDoctorId] = useState('');
  const [image, setImage] = useState(null);


  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsData = querySnapshot.docs.map(doc => ({
        label: doc.data().name, // Assuming each doc has a 'name' field
        value: doc.id, // Using Firestore document ID as value
      }));
      setDoctors(doctorsData);
    };

    fetchDoctors();
  }, []);


  const savePatient = async () => {
    try {
      let imageUrl = null;

      if (image) {
        imageUrl = await uploadImageAndGetURL(image);
      }


      const docRef = await addDoc(collection(db, "patients"), {
        image: imageUrl, // Save the image URL in the Firestore document
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        gender,
        bloodGroup,
        rhFactor,
        maritalStatus,
        ageFormat,
        phoneResidence,
        mobilePhone,
        emailAddress,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
        },
        assignedDoctorId,
      });
      Alert.alert("Success", "Patient created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error creating patient: ", error);
      Alert.alert("Error", "There was a problem creating the patient. Please try again.", [
        { text: "OK" }
      ]);
    }
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
      return true;
    }
    return false;
  };

  const pickImage = async () => {
    const hasPermission = await getPermissionAsync();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImageAndGetURL = async (imageUri) => {
    try {
      const blob = await uriToBlob(imageUri);
      const storage = getStorage();
      // Generate a unique filename for the image
      const fileName = `patient_images/${Date.now()}-${imageUri.split('/').pop()}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Failed to upload image and get URL:", error);
      throw error;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Patient</Text>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
            <Text>Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Middle Name"
        value={middleName}
        onChangeText={setMiddleName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (MM/DD/YYYY)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />


      <RNPickerSelect
        onValueChange={setGender}
        items={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        placeholder={{ label: "Gender", value: null }}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={setBloodGroup}
        items={[
          { label: "A+", value: "A+" },
          { label: "A-", value: "A-" },
          { label: "B+", value: "B+" },
          { label: "B-", value: "B-" },
          { label: "AB+", value: "AB+" },
          { label: "AB-", value: "AB-" },
          { label: "O+", value: "O+" },
          { label: "O-", value: "O-" },
        ]}
        placeholder={{ label: "Select Blood Group", value: null }}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={setRhFactor}
        items={[
          { label: "Positive (+)", value: "+" },
          { label: "Negative (-)", value: "-" },
        ]}
        placeholder={{ label: "Select RH Factor", value: null }}
        style={pickerSelectStyles}
      />

      <RNPickerSelect
        onValueChange={setMaritalStatus}
        items={[
          { label: "Single", value: "single" },
          { label: "Married", value: "married" },
          { label: "Divorced", value: "divorced" },
          { label: "Widowed", value: "widowed" },
        ]}
        placeholder={{ label: "Select Marital Status", value: null }}
        style={pickerSelectStyles}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Residence"
        keyboardType="phone-pad"
        value={phoneResidence}
        onChangeText={setPhoneResidence}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Phone"
        keyboardType="phone-pad"
        value={mobilePhone}
        onChangeText={setMobilePhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <Text style={styles.sectionHeader}>Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Name"
        value={emergencyContactName}
        onChangeText={setEmergencyContactName}
      />

      <TextInput
        style={styles.input}
        placeholder="Emergency Contact Phone"
        keyboardType="phone-pad"
        value={emergencyContactPhone}
        onChangeText={setEmergencyContactPhone}
      />

      <RNPickerSelect
        onValueChange={(value) => setAssignedDoctorId(value)}
        items={doctors}
        placeholder={{ label: "Select a Primary Care Provider", value: null }}
        style={pickerSelectStyles}
      />

      <Button title="Next" onPress={savePatient} />
    </ScrollView>
  )
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the dropdown icon doesn't overlap the text
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the dropdown icon doesn't overlap the text
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    
  },

  button: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
  }
});

export default CreatePatientScreen;
