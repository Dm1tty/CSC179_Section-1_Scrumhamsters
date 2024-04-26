import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs, doc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import * as DocumentPicker from 'expo-document-picker';
import { ref as storageRef, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { parseISO } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';





const LabEntryPage = ({}) => {
    const [loading, setLoading] = useState(true);
    const [fileUrl, setFileUrl] = useState('');
    const navigation = useNavigation();
    const [examResult, setExamResult] = useState({
        patient: '',
        testName: '',
        testDate: '',
        doctor: '',
        testResults: '',
        referenceRanges: '',
        comments: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

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

   
    const handleSubmit = async (uploadedUrl) => {
        console.log("Submitting with file URL:", uploadedUrl);

        if (!examResult.patient) {
            alert('Please select a patient.');
            return;
        }

        const parsedDate = parseISO(examResult.testDate);
        if (isNaN(parsedDate)) {
            alert('Invalid date format. Please correct the Test Date.');
            return;
        }

        if (!uploadedUrl) {
            alert('Please wait for the file to finish uploading or check file upload errors.');
            return;
        }

        try {
            const labResultRef = collection(db, "patients", examResult.patient, "labResults");
            await addDoc(labResultRef, {
                ...examResult,
                testDate: Timestamp.fromDate(parsedDate),
                attachedFile: uploadedUrl,
            });
            alert('Lab results submitted!');
            navigation.goBack();  // Ensure navigation is correctly managed in terms of state updates
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to submit lab results.');
        }
    };
    

    
    

    const uploadFile = async (uri) => {
        const filename = uri.split('/').pop();
        const fileRef = storageRef(getStorage(), `labResults/${filename}`);
        try {
            const blob = await (await fetch(uri)).blob();
            const snapshot = await uploadBytes(fileRef, blob);
            const url = await getDownloadURL(snapshot.ref);
            console.log("File uploaded, URL:", url);
            return url;
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload file.');
            return null;
        }
    };



    const handleFilePick = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: '*/*',  // Allows all types of documents
            copyToCacheDirectory: true
        });

        console.log("Document Picker Result:", JSON.stringify(result));

        if (!result || !result.assets || result.assets.length === 0) {
            console.log("No valid assets found in the result:", result);
            alert('No valid assets found.');
            return;
        }

        const fileUri = result.assets[0].uri;
        console.log("Picked file URI:", fileUri);
        const uploadedUrl = await uploadFile(fileUri);  // Wait for the URL
        if (uploadedUrl) {
            setFileUrl(uploadedUrl);  // Set the URL here
            handleSubmit(uploadedUrl);  // Pass the URL directly to handleSubmit
        }
    };

    
    
    
    
    
    


    const handleChange = (name, value) => {
        setExamResult(prev => ({ ...prev, [name]: value }));
    };
    function formatPlaceholder(key) {
        // Split the key at transitions from lowercase to uppercase
        const words = key.replace(/([A-Z])/g, ' $1').trim();
        // Capitalize the first letter of the entire result
        return words.charAt(0).toUpperCase() + words.slice(1);
    }
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
        handleChange('testDate', currentDate.toISOString());
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Patient Name</Text>
            <RNPickerSelect
                onValueChange={(value) => handleChange('patient', value)}
                items={patients}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a patient", value: null }}
            />

            {Object.entries(examResult).map(([key, value]) => (
                key !== 'doctor' && key !== 'patient' ? (
                    <TextInput
                        key={key}
                        placeholder={formatPlaceholder(key)}
                        value={value}
                        onChangeText={(text) => handleChange(key, text)}
                        style={styles.input}
                    />
                ) : null
            ))}
  <Button title="Choose Date" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}
            <Text style={styles.label}>Doctor's Name</Text>
            <RNPickerSelect
                onValueChange={(value) => handleChange('doctor', value)}
                items={doctors}
                style={pickerSelectStyles}
                placeholder={{ label: "Choose doctor", value: null }}
            />


            <TouchableOpacity style={styles.button} onPress={handleFilePick}>
                <Text style={styles.buttonText}>Attach File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Lab Results</Text>
            </TouchableOpacity>
        </ScrollView>
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
        padding: 10,
    },
  
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 14,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default LabEntryPage;