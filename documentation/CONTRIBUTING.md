# Contributing
This file is for instructions/guidelines for adding to the project. If you have experience you'd like to share with the team feel free to add to this document or create a new file in the documentation folder 👍

## A walkthrough of a simple change
If you've never used React before, or are new to React Native/Expo, here I'll walk you through making a simple change to the app. First, let's have a look at the main app code in [App.js](../project-healthcare-react-app/App.js)

```js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Add your name below and commit the change!</Text>
      <Text>Team members:</Text>
      <Text>Ian Charamuga</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```
The most important part of the code above are these lines:
```js
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Add your name below and commit the change!</Text>
      <Text>Team members:</Text>
      <Text>Ian Charamuga</Text>
      <Text>Marielle McBride</Text>
      <StatusBar style="auto" />
    </View>
  );
}
```
```export default function App()``` makes the ```App()``` function available for React Native to use. Later we will be making our own components in a subdirectory called *components*, adding a line like this to our file: ```export default function MyCustomComponent() {return <View>...</View>}```, and importing them into [App.js](../project-healthcare-react-app/App.js) like so:
```js
// App.js - importing your own custom component
import MyCustomComponent from './components/MyCustomComponent'
```
*For an example, see [ExampleComponent](../project-healthcare-react-app/components/ExampleComponent.js) and how it is used in [App.js](../project-healthcare-react-app/App.js)*

Looking back at the ```App``` function/component above, we are returning [JSX](https://react.dev/learn/writing-markup-with-jsx), which is just HTML that can be written inside of a javascript file. Unlike plain HTML, we can also add javascript inside of JSX by using curly brackets like the above line ```<View style={styles.container}>```, which sets the style of the ```<View>``` component to the ```const styles``` object we created below. The stylesheet is created by passing an object containing css styles to ```StyleSheet.create()```.

The ```<View>``` and ```<Text>``` components come from React Native. Not all React components like div, p, etc. are compatible with React Native, but instead have an equivalent component like View (--> div) or Text (--> p). For a full list of React Native components, look [here](https://reactnative.dev/docs/components-and-apis) on the React Native docs and [here](https://docs.expo.dev/versions/latest/) on the Expo SDK docs.

## Your first change
To make your first change, edit the return of ```App()``` to include your name in the list of team members, and change to color/font/size of your name. You can either use add to the ```styles``` object at the bottom of the file, make a new object with a fresh call to ```StyleSheet.create()```, or just inline the css in the element your name is in.

If you get stuck at any point or can't complete this tutorial reach out on the discord w/ any questions! 😊