import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar'; 


const PatientList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample patient data
  const patients = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 24 },
    { id: 3, name: 'Mike Johnson', age: 12 },
    { id: 4, name: 'Alice Brown', age: 57 },
    { id: 5, name: 'Chris Davis', age: 65 },
  ];

  // Mock function to simulate navigation
  const navigateToPatientPage = (patientId) => {
    console.log(`Navigating to patient page with ID: ${patientId}`);
    // Implement navigation logic here
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Patient List</Text>
        <FontAwesome name="search" size={24} color="black" style={{ marginRight: 10 }} />
        <MaterialIcons name="filter-list" size={24} color="black" />
      </View>

      <TextInput 
        placeholder="Search by name" 
        onChangeText={setSearchQuery} 
        style={styles.searchInput} 
      />

      <ScrollView style={styles.patientList}>
        {filteredPatients.map((patient) => (
          <TouchableOpacity key={patient.id} onPress={() => navigateToPatientPage(patient.id)}>
            <View style={styles.patientItem}>
              <Image source={require('../assets/favicon.png')} style={styles.icon} />
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientText}>Age: {patient.age}</Text>
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
