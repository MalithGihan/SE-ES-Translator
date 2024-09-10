import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CommonNavBtn from "../Components/CommonNavBtn";

export default function Home() {
  const navigation = useNavigation();

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");
      Alert.alert(
        "Onboarding cleared",
        "You will see the onboarding screens again when you restart the app."
      );
    } catch (err) {
      console.log("Error @clearOnboarding", err);
    }
  };

  const navigateToSignIn = () => {}

  return (
    <View style={styles.container}>
      <View style={styles.leftCorner}>
        <Text style={styles.text}>Home</Text>
      </View>
      
      <View style={styles.rightCorner}>
        <CommonNavBtn 
       title='Sign In'
       onPress={() => navigation.navigate("Welcome")}
       style={{ marginVertical: 8 }}
       />
      </View>

     

      <View style={styles.centeredButton}>
        <CommonNavBtn 
       title='Clear Onboarding'
       onPress={clearOnboarding}
       style={{ marginVertical: 8 }}
       />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftCorner: {
    position: 'absolute',
    top: 20, 
    left: 20, 
    zIndex: 1,
  },
  rightCorner: {
    position: 'absolute',
    top: 10, 
    right: 10, 
    zIndex: 1,
  },
  centeredButton: {
    flex: 1,
    bottom : 30,
    left : 10,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
