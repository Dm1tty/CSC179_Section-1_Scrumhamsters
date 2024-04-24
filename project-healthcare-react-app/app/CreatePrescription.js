/*import React, { useState, useEffect } from 'react';
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



*/






/////////////////////////asDFASDD------------------------------------------------------------


import React, { useState } from 'react';
import { View, TextInput, Button, Text, Switch, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function CreatePrescription() {
    const auth = getAuth();
    const [patientfName, setFirstName] = useState('');
    const [patientlName, setLastName] = useState('');
    const [DOB, setDOB] = useState(''); // Added for patient date of birth
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [gender, setGender] = useState(true); // true for Male, false for Female
    const [medication, setMed] = useState('');
    const [specialistType, setSpecialistType] = useState('');
    const [image, setImage] = useState(null);
    const navigation = useNavigation(); // Use the useNavigation hook

    const handleDOBChange = (text) => {
        const newText = text.replace(/[^0-9/]/g, ''); // Remove any non-numeric and non-slash characters
        if (newText.length > 10) {
          return; // Prevent more than 10 characters (DD/MM/YYYY)
        }
    
        // Formatting as DD/MM/YYYY
        let parts = newText.split('/').map(part => part.substring(0, 2)); // Split and limit parts to 2 digits
        if (parts[0]) parts[0] = Math.min(31, parseInt(parts[0], 10)).toString().padStart(2, '0'); // Day from 01 to 31
        if (parts[1]) parts[1] = Math.min(12, parseInt(parts[1], 10)).toString().padStart(2, '0'); // Month from 01 to 12
        if (parts.length > 2) parts[2] = parts[2].substring(0, 4); // Limit year to 4 digits
    
        const formattedText = parts.join('/').slice(0, 10); // Join parts and limit total length
        setDOB(formattedText);
      };






    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    

    const handleSaveProfile = async () => {
        console.log("handleSaveProfile called");
        let imageUrl = null;
        if (image) {
            try {
                imageUrl = await uploadImageAndGetURL(image);
            } catch (error) {
                alert(`Failed to upload image: ${error.message}`);
                return; // Exit the function if image upload fails
            }
        }

        // Construct the 'name' field using firstName and the first letter of lastName
        const name = `${firstName} ${lastName.charAt(0)}.`;

        const perscriptionInfo = {
            patientfName,
            patientlName,
            DOB,
            email,
            gender: gender ? 'Male' : 'Female',
            medication,
            specialistType,
            image: imageUrl, // Use the uploaded image URL or null if no image was selected
            name, // Add the constructed 'name' to the perscriptionInfo object
        };

        try {
            await setDoc(doc(db, "doctors", auth.currentUser.uid), perscriptionInfo);
            alert('Profile saved successfully');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Profile' }],
              });

        } catch (error) {
            alert(`Error saving profile: ${error.message}`);
        }
    };



    return (
        <View style={styles.container}>
            
            <TextInput 
              put placeholder="Patient first name" 
              value={patientfName} 
              onChangeText={setFirstName} 
              style={styles.input} />
            <TextInput 
              placeholder="Patient last Name" 
              value={patientlName} 
              onChangeText={setLastName} 
              style={styles.input} />
            <TextInput
                placeholder="DOB (DD/MM/YYYY)" 
                value={DOB} 
                onChangeText={handleDOBChange} 
                style={styles.input} 
                keyboardType="numeric"

                />
            <TextInput placeholder="Medication" value={medication} onChangeText={setMed} style={styles.input} />


            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />

            <View style={styles.switchContainer}>
                <Text>{gender ? 'Male' : 'Female'}</Text>
                <Switch value={gender} onValueChange={setGender} />
            </View>
            <Picker selectedValue={specialistType} onValueChange={(itemValue, itemIndex) => setSpecialistType(itemValue)} style={styles.picker}>
                <Picker.Item label="PA" value="PA" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Nurse" value="Nurse" />
            </Picker>
            <View style={{ marginBottom: 20 }} /> 
            <Button title="Save Profile" onPress={handleSaveProfile} color="#01011f" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1EB6B9',
        padding: 20,
    },
    input: {
        width: 300,
        padding: 10,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    placeholder: {
        width: 200,
        height: 200,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    picker: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});



/* <TouchableOpacity onPress={pickImage}>
                {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> : <View style={styles.placeholder}><Text>Upload Image</Text></View>}
            </TouchableOpacity>  */