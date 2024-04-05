import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar'; 
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebaseConfig'; // Adjust the import path to your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';



const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]); // Updated to store fetched patients



  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "patients"));
      const patientsData = querySnapshot.docs.map(doc => ({
        id: doc.id, // Use Firestore document ID as unique key
        ...doc.data(), // Spread operator to include all other patient fields
      }));
      setPatients(patientsData);
    };

    fetchPatients();
  }, []);

  const navigation = useNavigation();

  const navigateToPatientPage = (patientId, patientName) => {
    
    navigation.navigate('PatientDetail', { id: patientId, name: patientName });
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header and search input remain unchanged */}
      
      <ScrollView style={styles.patientList}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity key={patient.id} onPress={() => navigateToPatientPage(patient.id, patient.name)}>
            <View style={styles.patientItem}>
              <Image source={require('../assets/favicon.png')} style={styles.icon} />
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientText}>DOB: {patient.dob}</Text>
                <Text>View Patient</Text>
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
