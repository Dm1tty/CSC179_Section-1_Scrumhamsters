import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const VisitScreen = () => {

  const [doctor, setDoctor] = useState(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [cardiacMonitoring, setCardiacMonitoring] = useState('');
  const [visitSummary, setVisitSummary] = useState('');

  const route = useRoute();
  const navigation = useNavigation();

  const { patientData, appointmentId, patientId } = route.params ?? {};

  useEffect(() => {
    const fetchAppointmentAndDoctor = async () => {
      if (!patientId || !appointmentId) {
        console.error("Required IDs are not available:", {patientId, appointmentId});
        return; // Exit the function if IDs are not available
      }

      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointmentSnap = await getDoc(appointmentRef);
      if (appointmentSnap.exists()) {
        const appData = appointmentSnap.data();
        const doctorId = appData.doctor; // Assuming 'doctor' is the field for doctor ID

        if (doctorId) {
          const doctorRef = doc(db, 'doctors', doctorId);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            setDoctor(doctorSnap.data());
          } else {
            console.log('Doctor not found');
          }
        }
      } else {
        console.log('Appointment not found');
      }
    };

    fetchAppointmentAndDoctor();
  }, [appointmentId]);




  const handleSubmit = async () => {
    const patientRef = doc(db, 'patients', patientId); // Adjust 'id' as necessary
    const appointmentRef = doc(db, 'appointments', appointmentId);

    try {
      await updateDoc(patientRef, {
        height,  // Ensure height is defined
        weight,  // Ensure weight is defined
        bloodPressure,  // Ensure bloodPressure is defined
        cardiacMonitoring,  // Ensure cardiacMonitoring is defined
        visitSummary  // Ensure visitSummary is defined
      });

    // Update appointment status to 'Completed'
  await updateDoc(appointmentRef, {
    status: 'Completed'
  });

      console.log('Patient info and appointment status updated successfully.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'index' }],
      });
      // Optionally, navigate or reset form here
    } catch (error) {
      console.error('Failed to update documents:', error);
      console.error('Error occurred at value:', {
        height,
        weight,
        bloodPressure,
        cardiacMonitoring,
        visitSummary
      });
    }
  };

  return (
    <View >
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Visit Summary</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          value={patientData ? `${patientData.lastName}, ${patientData.firstName}` : ''}
          editable={false} // Assuming you don't want this field to be editable
        />
        <Text style={styles.label}>Assign Doctor</Text>
        <TextInput
          style={styles.input}
          value={doctor ? `${doctor.lastName}, ${doctor.firstName}` : ''}
          editable={false} // Assuming you don't want this field to be editable
        />
        <View style={styles.rowContainer}>
          <View style={[styles.halfWidth, styles.heightWeightContainer]}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter height"
              value={height}
              onChangeText={setHeight}
            />
          </View>
          <View style={[styles.halfWidth, styles.heightWeightContainer]}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter weight"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>BP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter blood pressure"
              value={bloodPressure}
              onChangeText={setBloodPressure}
            />
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Cardiac Monitoring</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cardiac monitoring details"
              value={cardiacMonitoring}
              onChangeText={setCardiacMonitoring}
            />
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Summary of visit"
          value={visitSummary}
          onChangeText={setVisitSummary}
        />

       
        <View style={styles.uploadContainer}>
          <Image
            source={require('../assets/upload-icon.png')}
            style={{ width: 18, height: 18, marginEnd: 20 }}
          />
          {/* <Icon name="file" size={24} color="#1EB6B9" style={styles.uploadIcon} /> */}
          <Text style={styles.uploadText}>Upload Prescription</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#1EB6B9',
    padding: 20,
    marginTop: 20
  },
  backButton: {
    marginRight: 20,
    marginTop: 10
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    flex: 1,
    textAlign: "center",
    marginTop: 10
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    color: '#888888'
  },
  input: {
    borderWidth: 1,
    borderColor: "#F2F2F2",
    borderRadius: 5,
    padding: 5,
    fontSize: 12,
    backgroundColor: '#ccc',
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  heightWeightContainer: {
    marginBottom: 0,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  calendarIcon: {
    marginLeft: 10,
  },

  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",

  },
  uploadIcon: {
    marginRight: 10,
  },
  uploadText: {
    fontSize: 14,
    color: '#1EB6B9'
  },
  button: {
    backgroundColor: '#1EB6B9',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,

  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VisitScreen;