import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';


const AppointmentsPage = () => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

<<<<<<< Updated upstream
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
    
  };
  
  // Filter appointments based on selected tab and search query
  const filteredAppointments = appointments.filter(appointment => {
    return appointment.type === selectedTab &&
           appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase());
  });
=======
  const navigation = useNavigation(); // Initialize navigation hook

  const navigateToAppintDeatilPage = (appointment) => {
    navigation.navigate('appointment_detail', {
      paramKey: {appointment},
    }); 
  };


  useEffect(() => {
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentsPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        
        const patientRef = doc(db, "patients", data.patient);
        const patientSnapshot = await getDoc(patientRef);
        const patientData = patientSnapshot.data();
        const appointmentDate = data.date?.toDate()?.toDateString() || 'N/A'; // Convert the 'date' Timestamp

        return {
          id: docSnapshot.id,
          ...data,
          patientName: patientData?.firstName + ", " + patientData.lastName, // Use optional chaining in case data is undefined
          dob: patientData?.dateOfBirth, 
          time: data.time || 'N/A', // Use the 'time' string directly
          date: appointmentDate
        };
      });

      const fetchedAppointments = await Promise.all(appointmentsPromises);
      setAppointments(fetchedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };

    fetchAppointments();
  }, []);
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        {filteredAppointments.map((appointment) => (
          <TouchableOpacity key={appointment.id} onPress={() => navigateToPatientPage(appointment.id)}>
            <View style={styles.appointmentItem}>
              <View style={styles.appointmentItemRow}>
                <Image source={require('../assets/favicon.png')} style={styles.icon} />
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentTitle}>{appointment.patientName}</Text>
                  <Text style={styles.appointmentText}>Age: {appointment.age}</Text>
                  <Text style={styles.appointmentText}>{new Date(appointment.time).toLocaleString()}</Text>
=======
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            // TODO: add navigation to appointment details scren
            <TouchableOpacity key={appointment.id} onPress={() => navigateToAppintDeatilPage(appointment)}>
              <View style={styles.appointmentItem}>
                <View style={styles.appointmentItemRow}>
                  <Image source={require('../assets/favicon.png')} style={styles.icon} />
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentTitle}>{appointment.patientName || "No Name"}</Text>
                    <Text style={styles.appointmentText}>DOB: {appointment.dob}</Text>
                    <Text style={styles.appointmentText}>Time: {appointment.time}</Text>
                    <Text style={styles.appointmentText}>Date: {appointment.date}</Text>
                  </View>
>>>>>>> Stashed changes
                </View>
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
