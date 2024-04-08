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
      <ScrollView style={styles.patientList}>
      {filteredPatients.map((patient) => (
  <TouchableOpacity key={patient.id} onPress={() => navigateToPatientPage(patient.id, `${patient.firstName} ${patient.lastName}`)}>
    <View style={styles.patientItem}>
      {patient.image ? (
        <Image source={{ uri: patient.image }} style={styles.icon} />
      ) : (
        // Fallback image if patient.image does not exist
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  patientList: {
    flex: 1,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    marginRight: 10,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  patientText: {
    fontSize: 14,
  },
});

export default PatientList;
