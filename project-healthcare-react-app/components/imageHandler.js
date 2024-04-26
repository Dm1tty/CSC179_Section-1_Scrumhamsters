import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Ensure the db import path is correct
import { Platform } from 'react-native';

export const getPermissionAsync = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
    }
};

export const pickImageAndUpdate = async (id, setPatientDetails) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        const imageUri = result.assets[0].uri; // Ensure to access the uri correctly
        uploadImageAndGetURL(id, imageUri).then((imageUrl) => {
            updatePatientImageUrl(id, imageUrl, setPatientDetails);
        }).catch((error) => {
            console.error("Error uploading image:", error);
            Alert.alert("Upload Failed", "There was an issue uploading your image.");
        });
    }
};

const uploadImageAndGetURL = async (id, imageUri) => {
    try {
        const blob = await (await fetch(imageUri)).blob();
        const storageRef = ref(getStorage(), `patient_images/${id}_${Date.now()}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert("Upload Failed", "There was an issue uploading the patient image.");
        throw new Error("Failed to upload image");
    }
};

const updatePatientImageUrl = async (id, imageUrl, setPatientDetails) => {
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
