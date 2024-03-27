import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';


const CreatePatientScreen = ({ navigation }) => {

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [primaryCareProvider, setPrimaryCareProvider] = useState('');
  const [doctors, setDoctors] = useState([]);



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
      const docRef = await addDoc(collection(db, "patients"), {
        name,
        phoneNumber,
        address,
        medicalHistory,
        primaryCareProvider,
      });
      Alert.alert("Success", "Patient created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() } // Or reset form as needed
      ]);
    } catch (error) {
      console.error("Error creating patient: ", error);
      Alert.alert("Error", "There was a problem creating the patient. Please try again.", [
        { text: "OK" }
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Patient</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        multiline
        value={address}
        onChangeText={setAddress}
      />
      <RNPickerSelect
        onValueChange={(value) => setPrimaryCareProvider(value)}
        items={doctors}
        placeholder={{ label: "Select a Primary Care Provider", value: null }}
        style={pickerSelectStyles} 
      />
      <TextInput
        style={styles.input}
        placeholder="Medical History"
        multiline
        value={medicalHistory}
        onChangeText={setMedicalHistory}
      />

     

      <Button title="Next" onPress={savePatient} />

    </ScrollView>)
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
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
