import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, Image, ScrollView, Button, ActivityIndicator, StyleSheet } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Index() {
  const [doctorName, setDoctorName] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorImage, setDoctorImage] = useState('https://via.placeholder.com/150'); // Default image
  const [loading, setLoading] = useState(true); // Loading indicator state

  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    
    const fetchDoctorData = async () => {
      setLoading(true); // Start loading

      const user = auth.currentUser;
      if (!user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignUp' }],
        });
        return;
      }

      const docRef = doc(db, "doctors", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctorName(docSnap.data().name);
        setDoctorImage(docSnap.data().image || 'https://via.placeholder.com/150'); // Fetch and set user's picture
      } else {
        console.log("No such document for doctor's name!");
      }

      const q = query(collection(db, "appointments"), where("doctor", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const appointmentsWithPatientInfo = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const appointment = docSnapshot.data();
        const patientRef = doc(db, "patients", appointment.patient);
        const patientSnap = await getDoc(patientRef);

        if (patientSnap.exists()) {
          const patientData = patientSnap.data();
          return {
            ...appointment,
            patientName: patientData.name,
            patientGender: patientData.gender,
            patientDOB: patientData.dob,
          };
        }
        return appointment;
      }));

      setAppointments(appointmentsWithPatientInfo);
      setLoading(false); // End loading
    };

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchDoctorData();
      }
    });

    return () => unsubscribe();
  }, [auth, navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Converts Firestore timestamp to a readable string
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Convert to JavaScript Date object
    return date.toDateString(); 
  };

  const calculateAge = (dob) => {
    const parts = dob.split("/");
    // Note: months are 0-based in JavaScript Date, hence the -1 on month
    const birthday = new Date(parts[2], parts[0] - 1, parts[1]);
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
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
      <View style={styles.table}>
        {appointments.map((appointment, index) => (
          <View key={index} style={styles.row}>
            <Image source={{ uri: appointment.patientPictureUrl || 'https://via.placeholder.com/150' }} style={styles.rowImage} />
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowText}>Patient: {appointment.patientName}</Text>
              <Text style={styles.rowText}>Gender: {appointment.patientGender}</Text>
              <Text style={styles.rowText}>Age: {calculateAge(appointment.patientDOB)}</Text>
              <Text style={styles.rowText}>Reason: {appointment.reason || 'N/A'}</Text>
              <Text style={styles.rowText}>Date: {formatDate(appointment.date)}</Text>
              <Text style={styles.rowText}>Time: {appointment.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    <View style={styles.buttonContainer}>
      <Button title="Create a Patient" onPress={() => navigation.navigate('CreatePatientScreen')} />
      <Button title="Create an Appointment" onPress={() => navigation.navigate('CreateAppointmentScreen')} />
      <Button title="Create a prescription" onPress={() => navigation.navigate('CreatePrescription')} />
    </View>
    <BottomNavBar style={styles.bottomNavBar} />
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  topImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
  table: {
    width: '100%',
    paddingHorizontal: 20, // Adjust padding instead of setting width to '90%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rowTextContainer: {
    marginLeft: 15, // Spacing between image and text
    flex: 1,
  },
  rowText: {
    fontSize: 14, // Slightly smaller text for better fit on various screens
    marginVertical: 2, // Reduce vertical spacing
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginBottom: 10,
    width: '80%', // Adjust the width as necessary
    // Add any additional styling for individual buttons here
  },
  
});