import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const windowWidth = Dimensions.get("window").width;

const AppointSchreen = () => {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.circularImageView}>
          <Image source={require('./assets/icon.png')} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>Anupama Gurung</Text>
          <Text style={styles.age}>32 yrs</Text>
        </View>
      </View>
      <View style={styles.detailesConatainer}>
        <Text style={styles.dateTimeText}>Wed ,12 May 24 |10:00 PM</Text>
        <View style={styles.itemContainer}>
          {/* Horizontal items */}
          <View style={styles.item}>
            {/* Icon image */}
            <Image
              source={require('.assets/mark-icon.png')}
              style={styles.icon}
            />
            {/* Text */}
            <Text style={styles.itemText}>Mark As{"\n"}Completed</Text>
          </View>

          <View style={styles.item}>
            {/* Icon image */}
            <Image
              source={require('./assest/delete-icon.png')}
              style={styles.icon}
            />
            {/* Text */}
            <Text style={styles.itemText}>Cancel{"\n"}Appointment</Text>
          </View>

          <View style={styles.item}>
            {/* Icon image */}
            <Image
              source={require('./assets/reschedule-icon.png')}
              style={styles.icon}
            />
            {/* Text */}
            <Text style={styles.itemText}>Reschedule{"\n"}Appointment</Text>
          </View>
        </View>
      </View>

      <View style={styles.patientDetaileContainer}>
        <Text style={styles.tagContainer}>Patient Detailes</Text>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Full Name</Text>
          <Text style={styles.value}>Anupama Gurung</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Age:</Text>
          <Text style={styles.value}>32 Years</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Gender</Text>
          <Text style={styles.value}>Female</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Phone NO:</Text>
          <Text style={styles.value}>7500190739</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Address:</Text>
          <Text style={styles.value}>2/4 ST. Tilak Road ,Dehradun</Text>
        </View>
        <View style={styles.keyValueContainer}>
          <Text style={styles.key}>Medical History</Text>
          <Text style={styles.value}>NO</Text>
        </View>

        <Text style={styles.tagContainer}>Prescription</Text>

      </View>
      <View style={styles.itemContainer}>
      <Image
              source={require('./assets/prescription-icon.png')}
              style={styles.document}
            />
        <Image
              source={require('./assets/prescription-icon.png')}
              style={styles.document}
            />
      </View>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  keyValueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  key: {
    fontSize: 14,
    color:'#888888'
    // Add any other styles as needed
  },
  value: {
    fontSize: 12,
    color:'#666666'
    // Add any other styles as needed
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
   
    backgroundColor: "#1EB6B9", // Background color for toolbar
    paddingVertical: 10,
    width: windowWidth, // Set width to the width of the device screen
  },
  content: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    alignItems: "start",
  },
  backButton: {
    marginLeft: 20,
  },
  circularImageView: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 10,
    marginLeft: 30,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  age: {
    fontSize: 12,
    color: "white",
  },
  detailesConatainer: {
    backgroundColor: "#E3FEFF",
  },
  dateTimeText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 20,
    color: "#09ABAE",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  item: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
  },

  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    textAlign: "center",
  },
  tagContainer: {
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#F2F2F2",
    padding: 10,
    fontWeight: "bold",
    color:'#666666',
    marginTop: 10,
  },
  patientDetaileContainer: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#1EB6B9',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal:20
  
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  document: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
});

export default AppointSchreen;