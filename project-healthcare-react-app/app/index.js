import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, Text, View, Image, ScrollView, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Index() {
  const [doctorName, setDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorImage, setDoctorImage] = useState('httrps://via.placeholder.com/150');
  const [loading, setLoading] = useState(true);

  const [menuVisible, setMenuVisible] = useState(false);


  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchDoctorData(user);
      } else {
        // No user is signed in, redirect to the SignUp screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUp' }],
        });
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  async function fetchDoctorData(user) {
    setLoading(true);
  
    const docRef = doc(db, "doctors", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDoctorName(docSnap.data().name);
      setDoctorImage(docSnap.data().image || 'https://via.placeholder.com/150');
    } else {
      console.log("No such document for doctor's name!");
    }
  
    const q = query(collection(db, "appointments"), where("doctor", "==", user.uid), where("status", "==", "Upcoming"));
    const querySnapshot = await getDocs(q);
    const appointmentsWithPatientInfo = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
      const appointment = {
        id: docSnapshot.id, // Capture the document ID here
        ...docSnapshot.data(),
        date: new Date(docSnapshot.data().date.seconds * 1000) // Assuming 'date' is a Firestore Timestamp
      };
  
      const patientRef = doc(db, "patients", appointment.patient);
      const patientSnap = await getDoc(patientRef);
      if (patientSnap.exists()) {
        const patientData = patientSnap.data();
        return {
          ...appointment,
          patientName: patientData.lastName + ", " + patientData.firstName,
          patientGender: patientData.gender,
          patientDOB: patientData.dateOfBirth,
          patientPicture: patientData.image,
        };
      }
      return appointment;
    }));
  
    appointmentsWithPatientInfo.sort((a, b) => a.date - b.date); // Sort by date
    setAppointments(appointmentsWithPatientInfo);
    setLoading(false);
  }
  
  const groupAppointments = (appointments) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
  
    const groups = appointments.reduce((acc, appointment) => {
      const appointmentDate = appointment.date;
      appointmentDate.setHours(0, 0, 0, 0); // Normalize appointment date
  
      const diffTime = appointmentDate - today;
      const diffDays = diffTime / (1000 * 3600 * 24);
  
      let key;
      if (diffDays < 0) {
        key = 'Past';
      } else if (diffDays === 0) {
        key = 'Today';
      } else if (diffDays === 1) {
        key = 'Tomorrow';
      } else {
        key = appointment.date.toDateString();
      }
  
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(appointment);
      return acc;
    }, {});
  
    return groups;
  };

  const appointmentSections = groupAppointments(appointments);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toDateString();
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
  

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <StatusBar style="auto" />
      <Image source={{ uri: doctorImage }} style={styles.topImage} />
      <Text style={styles.greeting}>Hi, {doctorName}</Text>
      {Object.entries(appointmentSections).map(([sectionName, sectionAppointments]) => (
  <View key={sectionName} style={styles.table}>
    <Text style={styles.sectionHeader}>{sectionName}</Text>
    {sectionAppointments.map((appointment, index) => (
      <TouchableOpacity
        key={index}
        style={styles.row}
        onPress={() => navigation.navigate('appointment_detail', { appointmentId: appointment.id })}
      >
        <Image source={{ uri: appointment.patientPicture || 'https://via.placeholder.com/150' }} style={styles.rowImage} />
        <View style={styles.rowTextContainer}>
          <Text style={styles.rowText}>Patient: {appointment.patientName}</Text>
          <Text style={styles.rowText}>Gender: {appointment.patientGender}</Text>
          <Text style={styles.rowText}>Age: {calculateAge(appointment.patientDOB)}</Text>
          <Text style={styles.rowText}>Reason: {appointment.reason || 'N/A'}</Text>
          <Text style={styles.rowText}>Date: {appointment.date.toDateString()}</Text>
          <Text style={styles.rowText}>Time: {appointment.time}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
))}
    </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity style={styles.modalContainer} onPress={toggleMenu}>
          <View style={styles.menuContainer}>
          <View style={styles.buttonContainer}>
              <Button title="Create a Patient" onPress={() => { navigation.navigate('CreatePatientScreen'); toggleMenu(); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Create an Appointment" onPress={() => { navigation.navigate('CreateAppointmentScreen'); toggleMenu(); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Create a Prescription" onPress={() => { navigation.navigate('CreatePrescription'); toggleMenu(); }} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Enter Lab Results" onPress={() => { navigation.navigate('LabEntryPage'); toggleMenu(); }} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <BottomNavBar style={styles.bottomNavBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },

  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  buttonContainer: {
    width: '100%', // This ensures the button fills its container
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  table: {
    width: '100%',
    paddingHorizontal: 20, // Adjust padding instead of setting width to '90%'

  },
  sectionHeader:{
    fontWeight: 'bold',
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rowTextContainer: {
    marginLeft: 15, // Spacing between image and text
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rowText: {
    fontSize: 14, // Slightly smaller text for better fit on various screens
    marginVertical: 2, // Reduce vertical spacing
  },
  topImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center'},

  menuContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  fab: {
    position: 'absolute',
    right: 30,
    bottom: 70,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1EB6B9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
  },
})