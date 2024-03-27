import React from 'react';
import { View, Text, ScrollView, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';


const CreatePatientScreen = ({ navigation }) => {

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Patient</Text>
      
      {/* Name Field */}
      <TextInput style={styles.input} placeholder="Name" />

      {/* Phone Number Field */}
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" />

      

      {/* Gender Selector */}
      {/* You can use a library or custom implementation */}
      
      {/* Address Field */}
      <TextInput style={styles.input} placeholder="Address" multiline />

      {/* Medical History Field */}
      <TextInput style={styles.input} placeholder="Medical History" multiline />
      
      {/* Select Date & Time (To be implemented) */}
      
      {/* Upload Prescription Button */}
      <TouchableOpacity onPress={() => {/* Functionality to upload prescription */}}>
        <Text>Upload Prescription</Text>
      </TouchableOpacity>
      
      {/* Assign Doctor Button */}
      <TouchableOpacity onPress={() => {/* Functionality to assign doctor */}}>
        <Text>Assign Doctor</Text>
      </TouchableOpacity>
      
      {/* Next Button */}
      <Button title="Next" onPress={() => {/* Navigate to the next screen or action */}} />
      
    </ScrollView>
  );
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
