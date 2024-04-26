import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import appIcon from '../assets/Notes.png';  // Adjust the path as necessary

export default function SignUpScreen() {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Use the useNavigation hook

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log('Signed up with:', userCredentials.user.email);
        navigation.navigate('ProfileCreation'); // Make sure 'ProfileCreation' is the correct route name
      })
      .catch(error => alert(error.message));
  };

  // Handler to navigate to the SignIn screen
  const navigateToSignIn = () => {
    navigation.navigate('signin'); // Replace 'SignIn' with your actual SignIn screen route name
  };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Patient Diary</Text>
        <Image source={appIcon} style={styles.image} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={text => setPassword(text)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToSignIn}>
          <Text style={styles.buttonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: '#1EB6B9',
  },
  input: {
    width: '90%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
borderRadius: 10,
  },
  title: {
    marginTop: 20, // Adjust the spacing as needed
    fontSize: 40, // Adjust the font size as neededr
    fontWeight: 'bold',
    color: 'white', // Adjust the color to match the screenshot
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    color: 'white',
  
  },
  image: {
    width: 150,  // Adjust the size as needed
    height: 150,  // Adjust the size as needed
  },
});
