import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebaseConfig'; // Adjust the import path to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';



const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsData);
    };

    fetchPatients();
  }, []);

  const navigation = useNavigation();

  const navigateToPatientPage = (patientId, patientName) => {
    navigation.navigate('PatientDetail', { id: patientId, name: patientName });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'; // Handle missing dob gracefully

    // Explicitly parse the MM/DD/YYYY format
    const parts = dob.split('/');
    const birthDate = new Date(parts[2], parts[0] - 1, parts[1]); // Note: months are 0-indexed

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };


  const filteredPatients = patients.filter(patient => {
    const fullName = [patient.firstName, patient.lastName]
      .filter(Boolean) // Remove undefined or falsy values
      .join(" ") // Join the remaining values into a full name string
      .toLowerCase(); // Convert the full name string to lowercase

    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Patients..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView style={styles.patientList}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity key={patient.id} onPress={() => navigateToPatientPage(patient.id, `${patient.firstName} ${patient.lastName}`)}>
            <View style={styles.patientItem}>
              {patient.image ? (
                <Image source={{ uri: patient.image }} style={styles.icon} />
              ) : (
                <Image source={require('../assets/favicon.png')} style={styles.icon} />
              )}
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{`${patient.lastName}, ${patient.firstName}`}</Text>
                <Text style={styles.patientText}>Age: {calculateAge(patient.dateOfBirth)}</Text>
                <Text style={styles.patientText}>Phone: {patient.phoneResidence || patient.mobilePhone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  patientList: {
    flex: 1,
  },
  patientItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  patientDetails: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientText: {
    fontSize: 16,
  },
});


export default PatientList;
