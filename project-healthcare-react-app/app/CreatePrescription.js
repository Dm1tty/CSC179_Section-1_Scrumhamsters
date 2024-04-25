
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { collection, getDocs, doc, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import medications from '../assets/medicine.json';


const CreatePrescription = () => {
    const auth = getAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const [prescription, setPrescription] = useState({
        medication: '',
        strength: '',
        amountPerDose: '',
        route: '',
        form: '',
        frequency: '',
        duration: '',
        purpose: '',
        refills: '',
        doctor: '',
        patient: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const doctorsSnapshot = await getDocs(collection(db, "doctors"));
            const patientsSnapshot = await getDocs(collection(db, "patients"));
            setDoctors(doctorsSnapshot.docs.map(doc => ({ label: doc.data().name, value: doc.id })));
            setPatients(patientsSnapshot.docs.map(doc => ({
                label: `${doc.data().lastName}, ${doc.data().firstName}`,
                value: doc.id
            })));
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleChange = (name, value) => {
        setPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!prescription.medication || !prescription.strength || !prescription.patient) {
            alert('Please fill in all required fields, including selecting a patient.');
            return;
        }
    
        try {
            // Accessing the subcollection 'prescriptions' under the specific patient's document
            const patientRef = doc(db, 'patients', prescription.patient);
            const prescriptionsRef = collection(patientRef, 'prescriptions');
    
            // Adding a new prescription document to the 'prescriptions' subcollection
            await addDoc(prescriptionsRef, {
                ...prescription,
                createdAt: Timestamp.fromDate(new Date())  // Adds a timestamp of creation
            });
    
            alert('Prescription saved successfully.');
            navigation.reset({
                index: 0,
                routes: [{ name: 'index' }],
              });
            
            setPrescription({
                medication: '',
                strength: '',
                amountPerDose: '',
                route: '',
                form: '',
                frequency: '',
                duration: '',
                purpose: '',
                refills: '',
                doctor: '',
                patient: ''
            });
        } catch (error) {
            console.error('Error saving prescription:', error);
            alert('Failed to save the prescription.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <RNPickerSelect
                onValueChange={(value) => handleChange('patient', value)}
                items={patients}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a patient", value: null }}
            />
            {Object.entries(prescription).map(([key, value]) => (
                key !== 'doctor' && key !== 'patient' ? (
                    <TextInput
                        key={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={value}
                        onChangeText={(text) => handleChange(key, text)}
                        style={styles.input}
                    />
                ) : null
            ))}
            <RNPickerSelect
                onValueChange={(value) => handleChange('doctor', value)}
                items={doctors}
                style={pickerSelectStyles}
                placeholder={{ label: "Prescribed by", value: null }}
            />
            <Button title="Save Prescription" style={styles.button} onPress={handleSubmit} />
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        color: 'white',
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1EB6B9',
        padding: 20,
    },
    input: {
        width: '100%',
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
    button: {
        backgroundColor: '#1EB6B9',
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        marginTop: 20,
    
      },
});




export default CreatePrescription;
