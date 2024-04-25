import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';

const AppointmentsPage = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();

        const patientRef = doc(db, "patients", data.patient);
        const patientSnapshot = await getDoc(patientRef);
        const patientData = patientSnapshot.data();
        const appointmentDate = data.date?.toDate()?.toDateString() || 'N/A';

        return {
          id: docSnapshot.id,
          ...data,
          patientName: patientData?.firstName + " " + patientData.lastName,
          dob: patientData?.dateOfBirth, 
          time: data.time || 'N/A',
          date: appointmentDate
        };
      });

      const fetchedAppointments = await Promise.all(appointmentsPromises);
      setAppointments(fetchedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [selectedTab, appointments, searchQuery]);

  const filterAppointments = () => {
    const filtered = appointments.filter(appointment =>
      appointment.status === selectedTab &&
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  const navigateToAppointmentDetails = (appointmentId) => {
    navigation.navigate('appointment_detail', { appointmentId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Appointments</Text>
        <TextInput
          placeholder="Search by name"
          value={searchQuery}
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
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} onPress={() => navigateToAppointmentDetails(appointment.id)}>
              <View style={styles.appointmentItem}>
                <View style={styles.appointmentItemRow}>
                  <Image source={require('../assets/favicon.png')} style={styles.icon} />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentTitle}>{appointment.patientName || "No Name"}</Text>
                    <Text style={styles.appointmentText}>DOB: {appointment.dob}</Text>
                    <Text style={styles.appointmentText}>Time: {appointment.time}</Text>
                    <Text style={styles.appointmentText}>Date: {appointment.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No appointments found.</Text>
        )}
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
