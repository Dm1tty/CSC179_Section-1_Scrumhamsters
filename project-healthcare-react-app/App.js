import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ExampleComponent from './components/ExampleComponent'

export default function App() {
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
  }
});
