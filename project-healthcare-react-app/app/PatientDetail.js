import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const PatientDetail = () => {
  const route = useRoute(); // Use useRoute to access the route object
  const { id, name } = route.params; // Access route parameters

  return (
    <View style={styles.container}>
      <Text>Patient ID: {id}</Text>
      <Text>Patient Name: {name}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PatientDetail;
