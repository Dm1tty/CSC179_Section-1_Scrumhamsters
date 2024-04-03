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
        navigation.navigate('Profile')
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
        <Image
        source={require('../assets/back-icon.png')}
        style={{ width: 26, height: 22 }}
      />
      <Text style={styles.title}>Sign In</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />



      <Text style={styles.indecator} >Mobile Number</Text>
      <View style={styles.inputContainer}>
        <View style={styles.countryCodeContainer}>
         
          <TextInput
            style={styles.countryCodeInput}
            value={countryCode}
            maxLength={4} 
            onChangeText={text => setCountryCode(text)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          maxLength={10} 
          value={mobileNumber}
          onChangeText={text => setMobileNumber(text)}
        />



      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={require('../assets/google-icon.png')}
          style={styles.googleImage}
        /> 
        <Text style={styles.googleText}>Continue With Google</Text>
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
    marginTop :50,
    marginHorizontal : 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
  },
  indecator: {
    fontSize: 14,
    marginTop: 20,
    color :'#1EB6B9'
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop :8,
    backgroundColor:'#F2F2F2'
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 5,
  },
  countryCodeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    minWidth: 50,
    width: 'auto', // Width to wrap content
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    marginLeft: 1,
    width: 'auto', // Width to wrap content
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
  googleButton: {
    flexDirection: 'row', // Make the button horizontal
    alignItems: 'center', // Align items horizontally
    justifyContent: 'center', // Center items vertically
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 20, // Adjust padding as needed
    borderRadius: 10,
    marginTop: 20,
  },
  googleImage: {
    width :22,
    height : 22,
    marginRight: 25, // Add some space between the image and text
  },
  googleText: {
    color:"#666666",
    fontSize: 16,
    fontWeight: 'normal',
    fontWeight:'500',
    textAlign: 'center',
  },
  privacyText: {
    marginHorizontal:10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop:50,
  },
  linkText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
