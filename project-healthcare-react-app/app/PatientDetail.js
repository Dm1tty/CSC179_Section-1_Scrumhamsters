import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig'; 
import { doc, getDoc, getDocs, collection, updateDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select'; // Import the picker

const PatientDetail = () => {
  const route = useRoute();
  const { id } = route.params; // The patient's ID passed from the previous screen

  const [patientDetails, setPatientDetails] = useState(null);
  const [doctorsList, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);



  useEffect(() => {
    const fetchPatientDetails = async () => {
      const docRef = doc(db, 'patients', id); // Create a reference to the document
      const docSnap = await getDoc(docRef); // Fetch the document

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPatientDetails(data);
        setSelectedDoctor(data.assignedDoctorId || null); // Set to null if no doctor is assigned
      } else {
        console.log("No such document!");
      }
    };


    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsList = querySnapshot.docs.map(doc => ({
        label: doc.data().name, // Assuming each doc has a 'name' field
        value: doc.id,
      }));
      setDoctors(doctorsList);
    };


    fetchDoctors();
    fetchPatientDetails();
  }, [id]);

  if (!patientDetails) {
    return <Text>Loading patient details...</Text>; // Display a loading message or spinner
  }
  const assignDoctor = async () => {
    const patientRef = doc(db, 'patients', id);

    // Update the patient document
    await updateDoc(patientRef, {
      assignedDoctorId: selectedDoctor,
    });

    console.log("Doctor assigned successfully");
  };
  // Render the patient details
  return (
    <View style={styles.container}>
      <Text>Patient ID: {id}</Text>
      <Text>Name: {patientDetails.name}</Text>
      <Text>Date of Birth: {patientDetails.dob}</Text>
      <Text>Address: {patientDetails.address}</Text>
      <Text>Gender: {patientDetails.gender}</Text>
      <Text>Assigned Specialist:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedDoctor(value)}
        items={doctorsList}
        style={pickerSelectStyles}
        value={selectedDoctor}
        placeholder={{ label: "Select a Specialist", value: null }}
      />
      <Button title="Assign Doctor" onPress={assignDoctor} />

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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  

});

export default PatientDetail;
