import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig'; // Ensure you have your Firebase configuration correctly set up
import { collection, addDoc, Timestamp } from 'firebase/firestore';



const CreatePatientScreen = ({ navigation }) => {

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');



  const savePatient = async () => {
    try {
      const docRef = await addDoc(collection(db, "patients"), {
        name,
        phoneNumber,
        address,
        medicalHistory,
        // Include other fields as necessary
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

      <TextInput
        style={styles.input}
        placeholder="Medical History"
        multiline
        value={medicalHistory}
        onChangeText={setMedicalHistory}
      />
      
      {/* Include other inputs and buttons as necessary */}

      <Button title="Next" onPress={savePatient} />
      
    </ScrollView>)
};



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
