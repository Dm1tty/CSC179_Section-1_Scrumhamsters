// ProfileCreation.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Switch, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function ProfileCreation() {
    const auth = getAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [gender, setGender] = useState(true); // true for Male, false for Female
    const [specialistType, setSpecialistType] = useState('');
    const [image, setImage] = useState(null);
    const navigation = useNavigation(); // Use the useNavigation hook

    const getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return false;
            }
            return true;
        }
        return false;
    };

    const pickImage = async () => {
        const hasPermission = await getPermissionAsync();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result); // Log the full result to inspect it


        if (!result.cancelled) {
            const imageUri = result.assets[0].uri; // Access the uri from the first item in the assets array
            setImage(imageUri);
            console.log("Image URI set:", imageUri);
        }
        else {
            console.log("Image picking was cancelled");
        }
    };


    const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
    };

    // Modify the uploadImage function to also return the download URL
    const uploadImageAndGetURL = async (imageUri) => {
        console.log("uploadImageAndGetURL called with URI:", imageUri);
        console.log("Starting upload...");
        try {
            const blob = await uriToBlob(imageUri);
            const storage = getStorage();
            const storageRef = ref(storage, `profile_Images/${auth.currentUser.uid}`);


            await uploadBytes(storageRef, blob); // Ensure this promise resolves
            console.log('Image uploaded successfully');
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Obtained download URL:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error("Failed to upload image and get URL:", error);
            throw error; // Rethrow error to catch it outside
        }
    };

    const handleSaveProfile = async () => {
        console.log("handleSaveProfile called");
        let imageUrl = null;
        if (image) {
            try {
                imageUrl = await uploadImageAndGetURL(image);
            } catch (error) {
                alert(`Failed to upload image: ${error.message}`);
                return; // Exit the function if image upload fails
            }
        }

        // Construct the 'name' field using firstName and the first letter of lastName
        const name = `${firstName} ${lastName.charAt(0)}.`;

        const userProfile = {
            firstName,
            lastName,
            phoneNumber,
            email,
            gender: gender ? 'Male' : 'Female',
            specialistType,
            image: imageUrl, // Use the uploaded image URL or null if no image was selected
            name, // Add the constructed 'name' to the userProfile object
        };

        try {
            await setDoc(doc(db, "doctors", auth.currentUser.uid), userProfile);
            alert('Profile saved successfully');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Profile' }],
              });

        } catch (error) {
            alert(`Error saving profile: ${error.message}`);
        }
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pickImage}>
                {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200 }} /> : <View style={styles.placeholder}><Text>Upload Image</Text></View>}
            </TouchableOpacity>
            <TextInput put placeholder="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} />
            <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} />
            <TextInput placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
            <TextInput placeholder="Email Address" value={email} onChangeText={setEmail} style={styles.input} />
            <View style={styles.switchContainer}>
                <Text>{gender ? 'Male' : 'Female'}</Text>
                <Switch value={gender} onValueChange={setGender} />
            </View>
            <Picker selectedValue={specialistType} onValueChange={(itemValue, itemIndex) => setSpecialistType(itemValue)} style={styles.picker}>
                <Picker.Item label="PA" value="PA" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Nurse" value="Nurse" />
            </Picker>
            <Button title="Save Profile" onPress={handleSaveProfile} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1EB6B9',
        padding: 20,
    },
    input: {
        width: 300,
        padding: 10,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    placeholder: {
        width: 200,
        height: 200,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    picker: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 5,
    },
});
