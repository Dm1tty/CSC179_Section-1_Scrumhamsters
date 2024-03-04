import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ExampleComponent from '../components/ExampleComponent'
import { Link } from 'expo-router';
import * as Linking from 'expo-linking'

export default function Index() {
  const testPatientUrl = Linking.createURL('patient/', {
    queryParams: { patient_id: '1'}
  })

  return (
    <View style={styles.container}>
      <View>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Add your name below and commit the change!{'\n'}</Text>
        
        <Text>Team members:</Text>
        <Text style={styles.nameIanCharamuga}>Ian Charamuga</Text>
        <StatusBar style="auto" />
      </View>
      <ExampleComponent/>
      <View>
        <Link style={styles.viewPatientButton} href={"patient/bob"}>
          View test patient
        </Link>
        <Link style={styles.viewPatientButton} href={testPatientUrl}>
          View test patient
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  nameIanCharamuga: {
    color: '#FF0000'
  },
  viewPatientButton: {
    borderWidth: 1,
    backgroundColor: "#11EE11",
    padding: 20
  }
});
