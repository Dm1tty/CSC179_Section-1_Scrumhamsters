import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import { startOfDay, addMinutes, format } from 'date-fns';

import { db } from '../firebaseConfig'; 
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';

import RNPickerSelect from 'react-native-picker-select'; // Import the picker


const CreateAppointmentScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false); // Control visibility of the date picker
    const [doctor, setDoctor] = useState('');
    const [patient, setPatient] = useState('');
    const [reason, setReason] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const querySnapshot = await getDocs(collection(db, "doctors"));
            const doctorsList = querySnapshot.docs.map(doc => ({
                label: doc.data().name, // Assuming each doc has a 'name' field
                value: doc.id,
            }));
            setDoctors(doctorsList);
        };

        const fetchPatients = async () => {
            const querySnapshot = await getDocs(collection(db, "patients"));
            const patientsList = querySnapshot.docs.map(doc => ({
                label: doc.data().lastName + ", " + doc.data().firstName, // Assuming each doc has a 'name' field
                value: doc.id,
            }));
            setPatients(patientsList);
        };

        fetchDoctors();
        fetchPatients();
    }, []);


    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios'); // For iOS, to keep the picker open
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const dateString = format(date, "PPP"); // Format the date into a readable string


    const generateTimeOptions = () => {
        let times = [];
        let startTime = startOfDay(new Date()); // Reset to the start of today
        startTime = addMinutes(startTime, 8 * 60); // Move to 8:00 AM
      
        for (let i = 0; i <= 23; i++) { // 8AM to 7:30PM
          let timeSlot = addMinutes(startTime, 30 * i);
          times.push({
            label: format(timeSlot, 'h:mm a'), // Example: "8:00 AM"
            value: format(timeSlot, 'HH:mm') // Example: "08:00" for easier backend handling
          });
        }
      
        return times;
      };

    const saveAppointment = async () => {
        try {

            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0); // Reset the time part to midnight

            const docRef = await addDoc(collection(db, "appointments"), {
                
                doctor,
                patient,
                date: Timestamp.fromDate(dateOnly), // Firestore Timestamp for the date
                time: appointmentTime, // Save the selected time
                reason,
                status: 'Upcoming'
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
            <RNPickerSelect
                onValueChange={(value) => setDoctor(value)}
                items={doctors}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a doctor", value: null }}
            />

            <RNPickerSelect
                onValueChange={(value) => setPatient(value)}
                items={patients}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a patient", value: null }}
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

                <RNPickerSelect
                    onValueChange={(value) => setAppointmentTime(value)}
                    items={generateTimeOptions()}
                    placeholder={{ label: "Select a time", value: null }}
                />

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
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // To ensure the dropdown icon doesn't overlap the text
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // To ensure the dropdown icon doesn't overlap the text
    },
});

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
    },

});

export default CreateAppointmentScreen;
