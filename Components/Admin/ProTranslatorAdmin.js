import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getProverbs, deleteProverb } from "../../utils/actions-proverbs/proverbAction.js";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProverbListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [proverbs, setProverbs] = useState([]);
  const [filteredProverbs, setFilteredProverbs] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");

  // Fetch proverbs when the component mounts or when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProverbs();
    });

    // Clean up the listener on component unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    let filtered = proverbs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
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
    }

    // Filter by type
    if (typeFilter && typeFilter !== "All") {
      filtered = filtered.filter((proverb) => proverb.type === typeFilter);
    }

    setFilteredProverbs(filtered);
  }, [searchQuery, proverbs, typeFilter]);

  const fetchProverbs = async () => {
    try {
      const fetchedProverbs = await getProverbs();
      setProverbs(fetchedProverbs);
      setFilteredProverbs(fetchedProverbs);
    } catch (error) {
      console.error("Error fetching proverbs:", error);
    }
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
              fetchProverbs(); // Refetch proverbs after delete
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

  const handleEdit = async (proverb) => {
    navigation.navigate("Add_ProWord", { proverb });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headertit}>Proverb Management</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Sinhalese Proverb or English Translation"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Picker
          selectedValue={typeFilter}
          onValueChange={(itemValue) => setTypeFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="ප්‍රස්තා පිරුළු" value="Proverb" />
          <Picker.Item label="නිසදැස්" value="Nisadas" />
        </Picker>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {filteredProverbs.map((proverb) => (
            <View key={proverb.id} style={styles.proverbContainer}>
              <Text style={styles.Text1}>{proverb.sinhaleseProverb}</Text>
              <Text style={styles.meaningText}>{proverb.singlishMeaning}</Text>
              <Text style={styles.Text1}>{proverb.englishTranslation}</Text>
              <Text style={styles.meaningText2}>{proverb.type}</Text>

              <View style={styles.btn}>
                <FontAwesome
                  name="edit"
                  color="black"
                  onPress={() => handleEdit(proverb)}
                  style={styles.deletebtn}
                />
                <FontAwesome
                  name="trash"
                  color="red"
                  onPress={() => handleDelete(proverb.id)}
                  style={styles.deletebtn}
                />
              </View>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Add_ProWord")}
        >
          <Ionicons name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
  },
  headertit: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 5,
    marginTop: 15,
    marginBottom: 20,
  },
  searchInput: {
    borderBottomWidth: 2,
    borderColor: "#000",
    padding: 10,
  },
  picker: {
    marginVertical: 5,
    backgroundColor: "#aaa",
    marginTop: 15,
  },
  proverbContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    shadowColor: "#aaa",
    gap: 10,
  },
  Text1: {
    fontSize: 15,
    fontWeight: "800",
  },
  meaningText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  meaningText2: {
    width: 90,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "800",
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#000",
    padding: 2,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deletebtn: {
    fontSize: 30,
    paddingHorizontal: 8,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    tintColor: "#fff",
    borderRadius: 50,
    padding: 1,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProverbListScreen;
