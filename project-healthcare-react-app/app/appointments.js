import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';

const AppointmentsPage = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = [
    { id: 1, type: 'Upcoming', patientName: 'John Doe', age: 30, time: '2023-10-20T14:00:00Z' },
    { id: 2, type: 'Missed', patientName: 'Jane Smith', age: 24, time: '2023-10-18T09:00:00Z' },
    { id: 3, type: 'Completed', patientName: 'Mike Johnson', age: 12, time: '2023-10-15T16:00:00Z' },
    { id: 4, type: 'Upcoming', patientName: 'Alice Brown', age:57, time: '2023-10-22T11:00:00Z' },
    { id: 5, type: 'Completed', patientName: 'Chris Davis', age: 65, time: '2023-10-16T10:00:00Z' },
  ].sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort appointments by time


  // Mock function to simulate navigation
  const navigateToPatientPage = (patientId) => {
    console.log(`Navigating to patient page with ID: ${patientId}`);
    // Here, you would use your navigation library to navigate,
    // e.g., navigation.navigate('PatientPage', { patientId: patientId });
  };
  
  // Filter appointments based on selected tab and search query
  const filteredAppointments = appointments.filter(appointment => {
    return appointment.type === selectedTab &&
           appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Appointments</Text>
        <TextInput placeholder="Search by name" onChangeText={setSearchQuery} style={styles.searchInput} />
      </View>

      <View style={styles.tabs}>
        <Button title="Upcoming" onPress={() => setSelectedTab('Upcoming')} color={selectedTab === 'Upcoming' ? 'blue' : 'grey'} />
        <Button title="Missed" onPress={() => setSelectedTab('Missed')} color={selectedTab === 'Missed' ? 'blue' : 'grey'} />
        <Button title="Completed" onPress={() => setSelectedTab('Completed')} color={selectedTab === 'Completed' ? 'blue' : 'grey'} />
      </View>

      <ScrollView style={styles.appointmentsList}>
        {filteredAppointments.map((appointment) => (
          <TouchableOpacity key={appointment.id} onPress={() => navigateToPatientPage(appointment.id)}>
            <View style={styles.appointmentItem}>
              <View style={styles.appointmentItemRow}>
                <Image source={require('../assets/favicon.png')} style={styles.icon} />
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentTitle}>{appointment.patientName}</Text>
                  <Text style={styles.appointmentText}>Age: {appointment.age}</Text>
                  <Text style={styles.appointmentText}>{new Date(appointment.time).toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30, // Set the size of your icon
    height: 30, // Set the size of your icon
    marginRight: 10, // Add some space between the icon and the text
  },
  appointmentDetails: {
    flex: 1, // Allow the details to fill the remaining space
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentsPage;
