import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, Image, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, updateDoc, Timestamp } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import illnessesList from '../assets/illnesses.json'

import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';

const PatientDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  const [patientDetails, setPatientDetails] = useState(null);
  const [illnesses, setIllnesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIllness, setSelectedIllness] = useState('');

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

    fetchPatientDetails();
  }, [id]);

  const updateFirestoreIllnesses = async (updatedIllnesses) => {
    const patientRef = doc(db, 'patients', id);
    await updateDoc(patientRef, {
      illnesses: updatedIllnesses.map(illness => ({
        ...illness,
        modifiedDate: toFirestoreTimestamp(illness.modifiedDate),
      })),
    });
  };

  const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
  };
  
  const pickImageAndUpdate = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        const imageUri = result.assets[0].uri; // Make sure to access the uri correctly
        uploadImageAndGetURL(imageUri).then((imageUrl) => {
            updatePatientImageUrl(imageUrl);
        }).catch((error) => {
            console.error("Error uploading image:", error);
            Alert.alert("Upload Failed", "There was an issue uploading your image.");
        });
    }
};
  
const uploadImageAndGetURL = async (imageUri) => {
  try {
      const blob = await (await fetch(imageUri)).blob();
      const storageRef = ref(getStorage(), `patient_images/${id}_${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
  } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Upload Failed", "There was an issue uploading the patient image.");
      throw new Error("Failed to upload image"); // It's important to throw an error so you can catch it outside
  }
};
const updatePatientImageUrl = async (imageUrl) => {
  try {
      const patientRef = doc(db, 'patients', id);
      await updateDoc(patientRef, {
          image: imageUrl,
      });

      // Update local state to reflect the new image without refetching from Firestore
      setPatientDetails(prevState => ({
          ...prevState,
          image: imageUrl,
      }));

      Alert.alert("Image Updated", "The patient's profile image has been successfully updated.");
  } catch (error) {
      console.error("Error updating patient image:", error);
      Alert.alert("Update Failed", "Failed to update the patient's profile image.");
  }
};

  const addIllness = async () => {
    console.log("Attempting to add illness:", selectedIllness);
    if (selectedIllness) {
      const newIllness = {
        id: new Date().getTime(), // Use current timestamp as a makeshift ID
        name: selectedIllness,
        status: 'current',
        modifiedDate: Timestamp.fromDate(new Date()),
      };
      const updatedIllnesses = [...illnesses, newIllness];
      console.log("Updated Illnesses:", updatedIllnesses);
      setIllnesses(updatedIllnesses);
      await updateFirestoreIllnesses(updatedIllnesses);
      setSelectedIllness('');
      setSearchTerm('');
    } else {
      console.log("No illness selected");
    }
  };



  const toFirestoreTimestamp = (dateValue) => {
    if (dateValue?.toDate) {
      return Timestamp.fromDate(dateValue.toDate());
    }
    const date = new Date(dateValue);
    if (!isNaN(date)) {
      return Timestamp.fromDate(date);
    }
    return Timestamp.fromDate(new Date());
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
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

  if (!patientDetails) {
    return <Text>Loading patient details...</Text>;
  }

  return (
    <View style={styles.container}>
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
    </View>
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
    
  },
  patientImage: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    borderRadius: 75, // For a rounded image
    marginVertical: 10, // Optional: add some vertical spacing
    alignItems: 'center',
    
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    margin: 10,
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#f0f0f0',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});


export default PatientDetail;
