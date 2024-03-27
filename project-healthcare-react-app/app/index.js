import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, Image, ScrollView, Button } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

import { useNavigation } from '@react-navigation/native';

import firebase, { getApps } from 'firebase/app';

import { db } from '../firebaseConfig';
import { getFirestore, collection, getDocs } from 'firebase/firestore';




// Sample data for appointments
const appointments = [
  {
    patientName: 'John Doe',
    age: 30,
    patientPictureUrl: 'https://via.placeholder.com/150',
    appointmentLength: '30 mins',
  },
  {
    patientName: 'Jane Smith',
    age: 24,
    patientPictureUrl: 'https://via.placeholder.com/150',
    appointmentLength: '45 mins',
  },

];

export default function Index() {
  fetchCollectionData();

  const navigation = useNavigation();


  return (
    <View style={styles.container}>
      <ScrollView>
        <StatusBar style="auto" />
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.topImage} />
        <Text style={styles.greeting}>Hi, Dr. Reed</Text>
        <View style={styles.table}>
          {appointments.map((appointment, index) => (
            <View key={index} style={styles.row}>
              <Image source={{ uri: appointment.patientPictureUrl }} style={styles.rowImage} />
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowText}>{appointment.patientName}</Text>
                <Text style={styles.rowText}>Age: {appointment.age}</Text>
                <Text style={styles.rowText}>Duration: {appointment.appointmentLength}</Text>
              </View>

            </View>
          ))}
        </View>
      </ScrollView>
      <Button
        title="Create a Patient"
        onPress={() => navigation.navigate('CreatePatientScreen')}
      />

      <Button
        title="Create an Appointment"
        onPress={() => navigation.navigate('CreateAppointmentScreen')}
      />
      <BottomNavBar />
    </View>
  );
}

// Function to fetch documents from a Firestore collection
async function fetchCollectionData() {
  const querySnapshot = await getDocs(collection(db, "patients"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20,
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  table: {
    marginHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  rowImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowText: {
    fontSize: 16,
  },
});
