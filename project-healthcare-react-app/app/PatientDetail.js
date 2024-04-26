import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Image, Alert, Platform, ScrollView, Linking, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, Timestamp, collection, getDocs } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import illnessesList from '../assets/illnesses.json'

import { getPermissionAsync, pickImageAndUpdate } from '../components/imageHandler'; // Adjust the import path as necessary


const PatientDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  const [patientDetails, setPatientDetails] = useState(null);
  const [illnesses, setIllnesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIllness, setSelectedIllness] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [labTests, setLabTests] = useState([]);




  useEffect(() => {
    const fetchPatientDetails = async () => {
      const docRef = doc(db, 'patients', id);
      const docSnap = await getDoc(docRef);



      if (docSnap.exists()) {
        const data = docSnap.data();
        setPatientDetails(data);
        setIllnesses(data.illnesses || []);
      } else {
        console.log("No such document!");
      }
    };
    fetchPrescriptions();
    fetchPatientDetails();
    fetchLabTests(); // Fetch lab tests

    getPermissionAsync(); // Ensure permissions are requested at component mount
  }, [id]);

  
  const fetchLabTests = async () => {
    const labTestsRef = collection(db, 'patients', id, 'labResults');
    const snapshot = await getDocs(labTestsRef);
    const labsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLabTests(labsList);
  };

  const fetchPrescriptions = async () => {
    const prescriptionsRef = collection(db, 'patients', id, 'prescriptions');
    const snapshot = await getDocs(prescriptionsRef);
    const prescriptionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPrescriptions(prescriptionsList);
  };
  const updateFirestoreIllnesses = async (updatedIllnesses) => {
    const patientRef = doc(db, 'patients', id);
    await updateDoc(patientRef, {
      illnesses: updatedIllnesses.map(illness => ({
        ...illness,
        modifiedDate: toFirestoreTimestamp(illness.modifiedDate),
      })),
    });
  };

  const moveIllnessToPast = async (illnessId) => {
    const updatedIllnesses = illnesses.map((illness) => {
      if (illness.id === illnessId) {
        return { ...illness, status: 'past', modifiedDate: new Date() };
      }
      return illness;
    });
    setIllnesses(updatedIllnesses);
    await updateFirestoreIllnesses(updatedIllnesses);
  };

  const deleteIllness = async (illnessId) => {
    const updatedIllnesses = illnesses.filter((illness) => illness.id !== illnessId);
    setIllnesses(updatedIllnesses);
    await updateFirestoreIllnesses(updatedIllnesses);
  };

  const filteredIllnesses = illnessesList
    .filter(illness => illness.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(illness => ({ label: illness, value: illness }));

  const addIllness = async () => {
    if (selectedIllness) {
      const newIllness = {
        id: new Date().getTime(), // Use current timestamp as a makeshift ID
        name: selectedIllness,
        status: 'current',
        modifiedDate: Timestamp.fromDate(new Date()),
      };
      const updatedIllnesses = [...illnesses, newIllness];
      setIllnesses(updatedIllnesses);
      await updateFirestoreIllnesses(updatedIllnesses);
      setSelectedIllness('');
      setSearchTerm('');
    } else {
      console.log("No illness selected");
    }
  };

  const toFirestoreTimestamp = (dateValue) => {
    let date;
  
    // Check if dateValue is a Firestore Timestamp and convert to JavaScript Date
    if (dateValue instanceof Timestamp) {
      date = dateValue.toDate();
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      try {
        // Assuming dateValue is a string that can be converted to a Date
        date = new Date(dateValue);
      } catch (error) {
        console.error("Failed to convert dateValue to Date:", dateValue);
        throw error;
      }
    }
  
    // Validate the date object
    if (isNaN(date.getTime())) {
      console.error("Invalid date input after conversion:", dateValue);
      throw new Error("Invalid date input");
    }
  
    return Timestamp.fromDate(date);
  };
  
  
  const openDocument = (url) => {
    Linking.openURL(url).catch(err => {
      console.error("Failed to open URL:", err);
      alert('Unable to open the document');
    })};

  const formatDate = (timestamp) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    } catch (error) {
      console.error("Failed to format date:", timestamp);
      return "Invalid date"; // Provide a fallback message
    }
  };

  if (!patientDetails) {
    return <Text>Loading patient details...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {patientDetails.image ? (
          <Image source={{ uri: patientDetails.image }} style={styles.patientImage} />
        ) : (
          <Text>No image available</Text>
        )}
        <Button title="Change Picture" onPress={pickImageAndUpdate} />

        <Text>Patient ID: {id}</Text>
        <Text>Name: {patientDetails.lastName}, {patientDetails.firstName}</Text>
        <Text>Date of Birth: {patientDetails.dateOfBirth}</Text>
        <Text>Gender: {patientDetails.gender}</Text>
      </View>


      <TextInput
        style={styles.input}
        placeholder="Type to search illnesses..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {!!searchTerm && (
        <RNPickerSelect
          onValueChange={(value) => {
            console.log("Selected illness value:", value);
            setSelectedIllness(value);
          }}
          items={filteredIllnesses}
          placeholder={{}}
          style={pickerSelectStyles}
          value={selectedIllness}
        />
      )}
      <Button title="Add Illness" onPress={addIllness} />
      <Text style={styles.sectionHeader}>Current Illnesses</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Illness Name</Text>
        <Text style={styles.tableHeaderText}>Modified Date</Text>
        <Text style={styles.tableHeaderText}>Actions</Text>
      </View>
      <FlatList
        data={illnesses.filter(illness => illness.status === 'current')}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{formatDate(item.modifiedDate)}</Text>
            <View style={[styles.tableCell, styles.actions]}>
              <Button title="Move to Past" onPress={() => moveIllnessToPast(item.id)} />
              <Button title="Delete" onPress={() => deleteIllness(item.id)} />
            </View>
          </View>
        )}
        keyExtractor={(item) => `${item.id}`}
      />
      <Text style={styles.sectionHeader}>Past Illnesses</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Illness Name</Text>
        <Text style={styles.tableHeaderText}>Modified Date</Text>
        <Text style={styles.tableHeaderText}>-</Text>
      </View>
      <FlatList
        data={illnesses.filter(illness => illness.status === 'past')}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.name}</Text>
            <Text style={styles.tableCell}>{formatDate(item.modifiedDate)}</Text>
            <Text style={styles.tableCell}>-</Text>
          </View>
        )}
        keyExtractor={(item, index) => `${item.name}_${index}`}
      />

      <Text style={styles.sectionHeader}>Prescriptions</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Medication</Text>
        <Text style={styles.tableHeaderText}>Strength</Text>
        <Text style={styles.tableHeaderText}>Frequency</Text>
        <Text style={styles.tableHeaderText}>Duration</Text>
        <Text style={styles.tableHeaderText}>Purpose</Text>
      </View>
      <FlatList
        data={prescriptions}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.medication}</Text>
            <Text style={styles.tableCell}>{item.strength}</Text>
            <Text style={styles.tableCell}>{item.frequency}</Text>
            <Text style={styles.tableCell}>{item.duration}</Text>
            <Text style={styles.tableCell}>{item.purpose}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
   <Text style={styles.sectionHeader}>Labs</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Test Name</Text>
    
        <Text style={styles.tableHeaderText}>Reference</Text>
        <Text style={styles.tableHeaderText}>Test Results</Text>
        <Text style={styles.tableHeaderText}>Attachment</Text>
      </View>
      <FlatList
        data={labTests}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.testName}</Text>
            <Text style={styles.tableCell}>{item.referenceRanges}</Text>
            <Text style={styles.tableCell}>{item.testResults}</Text>
            <TouchableOpacity onPress={() => openDocument(item.attachedFile)}>
              <Text style={styles.linkStyle}>View Result</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />




    </ScrollView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  patientImage: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    borderRadius: 75, // For a rounded image

  },
  imageContainer: {
    alignItems: 'center',  // This aligns children (the image) horizontally
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    margin: 10,
    borderRadius: 5,
  },
  linkStyle: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginTop: 10,
    backgroundColor: '#f0f0f0',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    padding: 3,
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white'

  },
});


export default PatientDetail;
