import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity ,Image} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from 'react-native-vector-icons/FontAwesome';

const VisitScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Dismiss the DateTimePicker when a date is selected
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleInputPress = () => {
    setShowDatePicker(true);
  };

  return (
    <View >

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={16} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visit Summary</Text>
      </View>
      <View style={styles.container}>
      <Text style={styles.label}>Patient Name</Text>
      <TextInput
        style={styles.input}
       
        // onChangeText={(text) => { /* handle input change */ }}
      />
      <Text style={styles.label}>Assign Doctor</Text>
      <TextInput
        style={styles.input}
        
        // onChangeText={(text) => { /* handle input change */ }}
      />
      <View style={styles.rowContainer}>
        <View style={[styles.halfWidth, styles.heightWeightContainer]}>
          <Text style={styles.label}>Height</Text>
          <TextInput
            style={styles.input}
            
            // onChangeText={(text) => { /* handle input change */ }}
          />
        </View>
        <View style={[styles.halfWidth, styles.heightWeightContainer]}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
           
            // onChangeText={(text) => { /* handle input change */ }}
          />
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>BP</Text>
          <TextInput
            style={styles.input}
            // onChangeText={(text) => { /* handle input change */ }}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Cardiac Monitoring</Text>
          <TextInput
            style={styles.input}
            // onChangeText={(text) => { /* handle input change */ }}
          />
        </View>
      </View>
      <Text style={styles.label}>Summary Of Visit</Text>
      <TextInput
        style={styles.input}
        // onChangeText={(text) => { /* handle input change */ }}
      />

      <Text style={styles.label}>Visit Date</Text>
      <TouchableOpacity style={styles.dateInputContainer} onPress={handleInputPress}>
        <TextInput
          style={[ { flex: 1 }]}
          placeholder="Select Visit Date"
          value={date.toDateString()} // Display the selected date
          editable={false}
        />
        <TouchableOpacity onPress={handleInputPress}>
          <Icon name="calendar" size={24} color="#1EB6B9" style={styles.calendarIcon} />
        </TouchableOpacity>
        
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
       <View style={styles.uploadContainer}>
       <Image
        source={require('../assets/upload-icon.png')}
        style={{ width: 18, height: 18 ,marginEnd:20}}
      />
        {/* <Icon name="file" size={24} color="#1EB6B9" style={styles.uploadIcon} /> */}
        <Text style={styles.uploadText}>Upload Prescription</Text>
      </View>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:'#1EB6B9',
    padding:20,
    marginTop:20
  },
  backButton: {
    marginRight: 20,
    marginTop:10
  },
  headerTitle: {
    fontSize: 18,
    color:'white',
    flex: 1,
    textAlign: "center", 
    marginTop:10
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    color:'#888888'
  },
  input: {
    borderWidth: 1,
    borderColor: "#F2F2F2",
    borderRadius: 5,
    padding: 5,
    fontSize: 12,
    backgroundColor:'#ccc',
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  heightWeightContainer: {
    marginBottom: 0,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  calendarIcon: {
    marginLeft: 10,
  },

  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding:15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
    
  },
  uploadIcon: {
    marginRight: 10,
  },
  uploadText: {
    fontSize: 14,
    color:'#1EB6B9'
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
});

export default VisitScreen;