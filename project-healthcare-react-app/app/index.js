import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ExampleComponent from '../components/ExampleComponent'
import { Link } from 'expo-router';
import * as Linking from 'expo-linking'
import BottomNavBar from '../components/BottomNavBar'; 


export default function Index() {
  const testPatientUrl = Linking.createURL('patient/', {
    queryParams: { patient_id: '1' }
  })

  return (
    <View style={styles.container}>
      <View>
        <StatusBar style="auto" />
      </View>
      <View>
      </View>
      <BottomNavBar />
      <StatusBar style="auto" />
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
  nameMohamedAhmed: {
    color: '#00FF00',
  },
  viewPatientButton: {
    borderWidth: 1,
    backgroundColor: "#11EE11",
    padding: 20
  }
});
