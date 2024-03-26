import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker'; // Ensure you have this installed
import { format } from 'date-fns'; // Assuming you have date-fns installed for date formatting

import { db } from '../firebaseConfig'; // Adjust the import path
import { collection, addDoc, Timestamp } from 'firebase/firestore';


const CreateAppointmentScreen = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // Control visibility of the date picker
  const [doctor, setDoctor] = useState('');
  const [patient, setPatient] = useState('');
  const [reason, setReason] = useState('');

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, to keep the picker open
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const dateString = format(date, "PPP"); // Format the date into a readable string

  const saveAppointment = async () => {
    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        doctor,
        patient,
        date,
        dateScheduled: Timestamp.fromDate(new Date(date)), // Convert JavaScript Date to Firestore Timestamp
        reason,
      });
      Alert.alert(
        "Success", // Alert Title
        "Appointment saved successfully!", // Alert Message
        [
          { text: "OK", onPress: () => navigation.goBack() } // Navigate back after pressing OK
        ]
      );
    } catch (error) {
      console.error("Error saving appointment: ", error);
      Alert.alert(
        "Error", // Alert Title
        "There was a problem saving the appointment. Please try again.", // Alert Message
        [
          { text: "OK" } // Button to dismiss the alert
        ]
      );
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Doctor"
        value={doctor}
        onChangeText={setDoctor}
      />
      <TextInput
        style={styles.input}
        placeholder="Patient"
        value={patient}
        onChangeText={setPatient}
      />



      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Select Date"
        value={dateString}
        onFocus={() => setShowDatePicker(true)} // Open date picker when the text input is focused
        editable={false} // Prevent manual editing
      />
      {showDatePicker && (
        <DatePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date(2025, 11, 31)} // Example: Set a maximum date
        />
      )}

      <Button title="Set Date" onPress={() => setShowDatePicker(true)} />


      </View>
      <TextInput
        style={styles.input}
        placeholder="Reason"
        multiline
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
      />
      <Button title="Save Appointment" onPress={saveAppointment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default CreateAppointmentScreen;
