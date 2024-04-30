import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Platform, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DatePicker from '@react-native-community/datetimepicker';
import { startOfDay, addMinutes, format } from 'date-fns';

import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

import RNPickerSelect from 'react-native-picker-select'; // Import the picker

const { width, height } = Dimensions.get('window');

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


    const onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };





    const saveAppointment = async () => {
        try {
            const formattedTime = format(date, 'HH:mm'); // Formats the date object to time string "HH:mm"
    
            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0); // Reset the time part to midnight
    
            const docRef = await addDoc(collection(db, "appointments"), {
                doctor,
                patient,
                date: Timestamp.fromDate(dateOnly), // Firestore Timestamp for the date
                time: formattedTime, // Save the formatted time
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
            <Text style={styles.label}>Schedule an Appointment</Text>
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
                <Text style={styles.label}>Date and Time</Text>
                <View style={styles.leftAlignContainer}>
                    <Button title="Set Date and Time" onPress={() => setShowDatePicker(true)} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Select Date and Time"
                    value={date.toLocaleString()}
                    onFocus={() => setShowDatePicker(true)}
                    editable={false}
                />
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        display="default"
                        onChange={onChangeDateTime}
                        maximumDate={new Date(2025, 11, 31)}
                    />
                )}
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
        justifyContent: 'space-between', // Adjusts spacing dynamically
    },
    label: {
        fontSize: width * 0.045, // Responsive font size based on screen width
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%', // Ensures the input takes full width available
        fontSize: width * 0.04, // Smaller responsive font size
    },
    datePickerContainer: {
        marginBottom: 20,
        width: '100%', // Full width to accommodate internal elements
    },
    leftAlignContainer: {
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: width * 0.04,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: width * 0.04,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
});

export default CreateAppointmentScreen;
