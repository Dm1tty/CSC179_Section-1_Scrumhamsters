import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const auth = getAuth();
  const navigation = useNavigation(); // Use the useNavigation hook

  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleGoogleSignIn = () => {
    // Logic for Google sign-in goes here
    console.log('Signing in with Google');
  };


  // Sign-in function
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log('User signed in: ', user.email);
        // Navigate to your next screen or show success message here
        navigation.reset({
          index: 0,
          routes: [{ name: 'Profile' }],
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // Handle errors here, such as showing an alert
        alert(errorMessage);
      });
  };




  return (
    <View style={styles.container}>

      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Email" value={email} style={styles.input} onChangeText={setEmail} />
        <TextInput placeholder="Password" value={password} style={styles.input} onChangeText={setPassword} secureTextEntry />


      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Text style={styles.privacyText}>
        By continuing you agree to our{' '}
        <Text style={styles.linkText} onPress={() => console.log('Terms clicked')}>
          Terms of Service
        </Text>{' '}
        and{' '}
        <Text style={styles.linkText} onPress={() => console.log('Privacy Policy clicked')}>
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginTop: 25,
  },
  inputContainer: {
    flexDirection: 'column',  // Align items vertically
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: '#F2F2F2'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 50, // Explicit height for better control
    width: '100%',
    marginBottom: 10,
    color: 'black', // Ensure this is visible against the input background
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
  privacyText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
export default SignInScreen;
