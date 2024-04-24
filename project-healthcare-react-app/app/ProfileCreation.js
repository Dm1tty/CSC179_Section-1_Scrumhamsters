// ProfileCreation.js
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { makeStyles, useTheme } from '@rneui/themed';
import { Button, Input } from '@rneui/themed';


export default function ProfileCreation() {
    const auth = getAuth();
    const styles = useStyles();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState(auth.currentUser?.email || '');
    const [gender, setGender] = useState('Male');
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
            const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);


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
            gender,
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
        <ScrollView
            style={styles.container} // Apply styles affecting the ScrollView's container here
            contentContainerStyle={styles.contentContainer} // Apply styles affecting the layout of children here
        >
            <TouchableOpacity onPress={pickImage}>
                {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.placeholder}><Text>Upload Image</Text></View>}
            </TouchableOpacity>
            <Input label="First Name:" labelStyle={styles.label} value={firstName} onChangeText={setFirstName} style={styles.input} />
            <Input label="Last Name:" labelStyle={styles.label} value={lastName} onChangeText={setLastName} style={styles.input} />
            <Input label="Phone Number:" labelStyle={styles.label} value={phoneNumber} onChangeText={setPhoneNumber} style={styles.input} />
            <Input label="Email Address:" labelStyle={styles.label} value={email} onChangeText={setEmail} style={styles.input} />
            <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                <Text style={styles.label}>Gender:</Text>
            </View>
            <Picker selectedValue={gender} onValueChange={(itemValue, itemIndex) => setGender(itemValue)} style={styles.picker} itemStyle={styles.pickerItem}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
            </Picker>
            <View style={{ padding: 10 }}>
                <Text style={styles.label}>Specialist Type:</Text>
            </View>
            <Picker selectedValue={specialistType} onValueChange={(itemValue, itemIndex) => setSpecialistType(itemValue)} style={styles.picker} itemStyle={styles.pickerItem}>
                <Picker.Item label="PA" value="PA" />
                <Picker.Item label="Doctor" value="Doctor" />
                <Picker.Item label="Nurse" value="Nurse" />
            </Picker>
            <Button buttonStyle={styles.saveButton} titleStyle={styles.saveButtonTitle} title="Save Profile" onPress={handleSaveProfile} />
        </ScrollView>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.colors.primary,
        flex: 1,
        padding: 10,
        margin: 0,
    },
    input: {
        width: 300,
        color: "#fff",
        fontSize: 12,
        height: 7,
        padding: 10,
        margin: 5,
        backgroundColor: '#333',
        borderRadius: 30,
    },
    label: {
        color: "#fff",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 14,
        paddingLeft: 10,
    },
    placeholder: {
        width: 100,
        height: 100,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        margin: 10,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        alignItems: 'center',
        margin: 10,
    },
    picker: {
        alignSelf: "center",
        backgroundColor: '#333',
        color: '#fff',
        width: 300,
        borderRadius: 30,
        fontSize: 12,
    },
    pickerItem: {
        color: '#fff',
        backgroundColor: '#333',
        borderRadius: 30,
        fontSize: 12,
    },
    saveButton: {
        margin: 20,
        padding: 0,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    saveButtonTitle: {
        margin: 10,
        padding: 0,
        color: theme.colors.primary,
    },
    contentContainer: {
        justifyContent: 'center', // Moved justifyContent to contentContainerStyle
        // any other layout affecting styles for children go here
    },
}));
