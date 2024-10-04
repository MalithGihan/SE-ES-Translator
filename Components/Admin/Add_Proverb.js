import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet,Text } from "react-native";
import CustomButton from "../../Screens/Login/CustomButton"; // Your button component
import {
  addProverb,
  updateProverb,
} from "../../utils/actions-proverbs/proverbAction.js";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker"; // Import the Picker

const AddProverbScreen = ({ route, navigation }) => {
  const [sinhaleseProverb, setSinhaleseProverb] = useState("");
  const [singlishMeaning, setSinglishMeaning] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [selectedType, setSelectedType] = useState("Proverb"); // State for Picker
  const [isLoading, setIsLoading] = useState(false);
  const { proverb } = route.params || {}; // Retrieve the proverb if editing

  useEffect(() => {
    if (proverb) {
      setSinhaleseProverb(proverb.sinhaleseProverb);
      setSinglishMeaning(proverb.singlishMeaning);
      setEnglishTranslation(proverb.englishTranslation);
      setSelectedType(proverb.type || "Proverb"); // Assume type is part of the proverb object
    }
  }, [proverb]);

  const handleSubmit = async () => {
    if (!sinhaleseProverb || !englishTranslation) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Both fields are required.",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (proverb) {
        await updateProverb(
          proverb.id,
          sinhaleseProverb,
          singlishMeaning,
          englishTranslation,
          selectedType
        ); // Pass type to update function
        Toast.show({
          type: "success",
          text1: "Updated!",
          text2: "Proverb updated successfully!",
          position: "bottom",
          visibilityTime: 2000,
        });
      } else {
        await addProverb(
          sinhaleseProverb,
          singlishMeaning,
          englishTranslation,
          selectedType
        ); // Pass type to add function
        Toast.show({
          type: "success",
          text1: "Added!",
          text2: "Proverb added successfully!",
          position: "bottom",
          visibilityTime: 2000,
        });
      }
      navigation.goBack(); // Navigate back to the list
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to save proverb.",
        position: "bottom",
        visibilityTime: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headertit}>Add Proverb/Nisadas</Text>
      </View>
      <Picker
        selectedValue={selectedType}
        onValueChange={(itemValue) => setSelectedType(itemValue)} 
        style={styles.picker} 
      >
        <Picker.Item label="ප්‍රස්තා පිරුළු" value="Proverb" />
        <Picker.Item label="නිසදැස්" value="Nisadas" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Enter Sinhalese Proverb"
        value={sinhaleseProverb}
        onChangeText={setSinhaleseProverb}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Singlish Meaning"
        value={singlishMeaning}
        onChangeText={setSinglishMeaning}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter English Translation"
        value={englishTranslation}
        onChangeText={setEnglishTranslation}
      />
      <CustomButton title={proverb ? "Update" : "Add"} onPress={handleSubmit} />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  headertit: {
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 5,
    marginTop: 15,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    backgroundColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default AddProverbScreen;
