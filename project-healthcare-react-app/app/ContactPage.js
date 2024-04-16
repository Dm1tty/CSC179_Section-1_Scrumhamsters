import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Logic to submit the form
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      {submitted ? (
        <View>
          <Text>Thank you! Someone will reach out to you shortly.</Text>
        </View>
      ) : (
        <View>
          <Text>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
          />

          <Text>Phone Number:</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Your Phone Number"
            keyboardType="phone-pad"
          />

          <Text>Email:</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your Email"
            keyboardType="email-address"
          />

          <Text>Issue:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={issue}
            onChangeText={setIssue}
            placeholder="Describe your issue"
            multiline
          />

          <Button title="Submit" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
});

export default ContactPage;
