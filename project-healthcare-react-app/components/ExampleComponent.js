import { StyleSheet, Text, View } from 'react-native';

export default function ExampleComponent() {
    return (
        <View style={styles.exampleComponent}>
            <Text>This is an example component</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  exampleComponent: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: '#000',
    padding: 50,
  },
});