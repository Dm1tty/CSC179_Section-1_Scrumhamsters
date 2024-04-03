import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Button, StyleSheet } from 'react-native';

import { db } from '../firebaseConfig'; 
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';

import RNPickerSelect from 'react-native-picker-select'; // Import the picker

const CreatePerscription = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [patientRx, setPatientRx] = useState(''); // Added field for patient Rx
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


      const savePrescription = async () => {
        try {
          const docRef = await addDoc(collection(db, "prescriptions"), {
            name,
            phoneNumber,
            address,
            patientRx, // Include patient Rx in data to save
            additionalField, // Include the additional field data to save
            primaryCareProvider,
          });
          Alert.alert("Success", "Prescription created successfully!", [
            { text: "OK", onPress: () => navigation.goBack() }
          ]);
        } catch (error) {
          console.error("Error creating prescription: ", error);
          Alert.alert("Error", "There was a problem creating the prescription. Please try again.", [
            { text: "OK" }
          ]);
        }
      };

      return (
        <ScrollView style={styles.container}>
          <Text style={styles.header}>Create New Prescription</Text>

        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
        />
        <TextInput
            style={styles.input}
            placeholder="Patient Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
        />
        <TextInput
            style={styles.input}
            placeholder="Patient Rx"
            multiline
            value={patientRx}
            onChangeText={setPatientRx}
        />

        <TextInput
            style={styles.input}
            placeholder="Patient Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
        />

        <RNPickerSelect
            onValueChange={(value) => setPrimaryCareProvider(value)}
            items={doctors}
            placeholder={{ label: "Select a Primary Care Provider", value: null }}
            style={pickerSelectStyles}
        />



        <Button title="Next" onPress={savePrescription} />

          </ScrollView>
          );
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
              paddingRight: 30,
            },
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 0.5,
              borderColor: 'purple',
              borderRadius: 8,
              color: 'black',
              paddingRight: 30,
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




export default CreatePerscription;
