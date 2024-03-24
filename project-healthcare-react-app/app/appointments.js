import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const AppointmentsPage = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const appointments = [
    { id: 1, type: 'Upcoming', patientName: 'John Doe', time: '2023-10-20T14:00:00Z' },
    { id: 2, type: 'Missed', patientName: 'Jane Smith', time: '2023-10-18T09:00:00Z' },
    { id: 3, type: 'Completed', patientName: 'Mike Johnson', time: '2023-10-15T16:00:00Z' },
    { id: 4, type: 'Upcoming', patientName: 'Alice Brown', time: '2023-10-22T11:00:00Z' },
    { id: 5, type: 'Completed', patientName: 'Chris Davis', time: '2023-10-16T10:00:00Z' },
  ].sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort appointments by time

  // Filter appointments based on selected tab and search query
  const filteredAppointments = appointments.filter(appointment => {
    return appointment.type === selectedTab &&
           appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Appointments</Text>
        <TextInput
          placeholder="Search by name"
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.tabs}>
        <Button title="Upcoming" onPress={() => setSelectedTab('Upcoming')} color={selectedTab === 'Upcoming' ? 'blue' : 'grey'} />
        <Button title="Missed" onPress={() => setSelectedTab('Missed')} color={selectedTab === 'Missed' ? 'blue' : 'grey'} />
        <Button title="Completed" onPress={() => setSelectedTab('Completed')} color={selectedTab === 'Completed' ? 'blue' : 'grey'} />
      </View>

      <ScrollView style={styles.appointmentsList}>
        {filteredAppointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <Text style={styles.appointmentText}>{appointment.patientName}</Text>
            <Text style={styles.appointmentText}>{new Date(appointment.time).toLocaleString()}</Text>
          </View>
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
  appointmentItem: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
  },
});

export default AppointmentsPage;
