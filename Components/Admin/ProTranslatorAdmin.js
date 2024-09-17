import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Alert, Text } from "react-native";
import CustomButton from "../../Screens/Login/CustomButton";
import {
  addProverb,
  getProverbs,
  updateProverb,
  deleteProverb,
} from "../../utils/actions-proverbs/proverbAction.js";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";

export default ProTranslatorAdmin = ({ navigation }) => {
  const [sinhaleseProverb, setSinhaleseProverb] = useState("");
  const [singlishMeaning, setSinglishMeaning] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proverbs, setProverbs] = useState([]);
  const [editingProverb, setEditingProverb] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProverbs, setFilteredProverbs] = useState([]);

  useEffect(() => {
    fetchProverbs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = proverbs.filter(
        (proverb) =>
          proverb.sinhaleseProverb
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          proverb.englishTranslation
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          proverb.singlishMeaning
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredProverbs(filtered);
    } else {
      setFilteredProverbs(proverbs);
    }
  }, [searchQuery, proverbs]);

  const fetchProverbs = async () => {
    try {
      const fetchedProverbs = await getProverbs();
      setProverbs(fetchedProverbs);
      setFilteredProverbs(fetchedProverbs);
    } catch (error) {
      console.error("Error fetching proverbs:", error);
    }
  };

  const createOrUpdateProverb = async () => {
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
      if (editingProverb) {
        await updateProverb(
          editingProverb.id,
          sinhaleseProverb,
          singlishMeaning,
          englishTranslation
        );
        Toast.show({
          type: "success",
          text1: "Added!",
          text2: "Proverb updated successfully!",
          position: "bottom",
          visibilityTime: 2000,
        });
      } else {
        await addProverb(sinhaleseProverb, singlishMeaning, englishTranslation);
        Toast.show({
          type: "success",
          text1: "Added!",
          text2: "Proverb updated successfully!",
          position: "bottom",
          visibilityTime: 2000,
        });
      }
      setSinhaleseProverb("");
      setSinglishMeaning("");
      setEnglishTranslation("");
      setEditingProverb(null);
      fetchProverbs();
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

  const handleEdit = (proverb) => {
    setEditingProverb(proverb);
    setSinhaleseProverb(proverb.sinhaleseProverb);
    setSinglishMeaning(proverb.singlishMeaning);
    setEnglishTranslation(proverb.englishTranslation);
  };

  const handleDelete = (proverbId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this proverb?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteProverb(proverbId);
              fetchProverbs();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to delete proverb.",
                position: "bottom",
                visibilityTime: 2000,
              });
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter Sinhalese Proverb"
          placeholderTextColor="#aaaaaa"
          onChangeText={setSinhaleseProverb}
          value={sinhaleseProverb}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Singlish Meaning"
          placeholderTextColor="#aaaaaa"
          onChangeText={setSinglishMeaning}
          value={singlishMeaning}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter English Translation"
          placeholderTextColor="#aaaaaa"
          onChangeText={setEnglishTranslation}
          value={englishTranslation}
        />
        <CustomButton
          title={editingProverb ? "Save Changes" : "Add Proverb"}
          onPress={createOrUpdateProverb}
          isLoading={isLoading}
          style={{ marginVertical: 8 }}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search by Sinhalese Proverb or English Translation"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {filteredProverbs.map((proverb) => (
            <View key={proverb.id} style={styles.proverbContainer}>
              <Text style={styles.proverbText}>{proverb.sinhaleseProverb}</Text>
              <Text style={styles.meaningText}>{proverb.singlishMeaning}</Text>
              <Text style={styles.translationText}>
                {proverb.englishTranslation}
              </Text>
              <CustomButton
                title="Edit"
                onPress={() => handleEdit(proverb)}
                isLoading={isLoading}
              />
              <CustomButton
                title="Delete"
                onPress={() => handleDelete(proverb.id)}
                isLoading={isLoading}
                style={{ borderColor: "red", color: "red" }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <>
        <Toast />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginVertical: 8,
  },
  proverbContainer: {
    marginVertical: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  searchInput: {
    height: 50,
    paddingVertical: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
  },
  scrollViewContent: {
    padding: 10,
  },
  proverbText: {
    fontSize: 20,
    margin: 5,
  },
  meaningText: {
    fontSize: 15,
    margin: 5,
    fontWeight: "300",
  },
  translationText: {
    fontSize: 25,
    margin: 5,
    fontWeight: "500",
  },
});
