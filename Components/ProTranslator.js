import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getProverbs } from "../utils/actions-proverbs/proverbAction";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

export default ProTranslator = () => {
  const [proverbs, setProverbs] = useState([]);
  const [enteredtext, setenteredtext] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("si");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProverbs();
  }, []);

  const fetchProverbs = async () => {
    try {
      setLoading(true);
      const fetchedProverbs = await getProverbs();
      setProverbs(fetchedProverbs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching proverbs:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setFromLang((prev) => (prev === "en" ? "si" : "en"));
    setToLang((prev) => (prev === "si" ? "en" : "si"));
    setenteredtext("");
    setSuggestions([]);
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: fromLang === "en" ? "en" : "si",
    });
  };

  const copyToClipboard = async (text) => {
    if (text) {
      await Clipboard.setStringAsync(text);
      Toast.show({
        type: 'success',
        text1: 'Copied!',
        text2: 'Translation copied to clipboard!',
        position: 'bottom',
        visibilityTime: 2000, 
      });
    }
  };

  const handleTextChange = (text) => {
    setenteredtext(text);

    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }

    let filteredProverbs = [];
    if (fromLang === "en") {
      filteredProverbs = proverbs.filter((proverb) =>
        proverb.englishTranslation.toLowerCase().includes(text.toLowerCase())
      );
    } else {
      filteredProverbs = proverbs.filter(
        (proverb) =>
          proverb.sinhaleseProverb.toLowerCase().includes(text.toLowerCase()) ||
          proverb.singlishMeaning.toLowerCase().includes(text.toLowerCase())
      );
    }

    setSuggestions(filteredProverbs);
  };

  return (
    <View style={styles.page}>
      <View style={styles.formContainer}>
        <View style={styles.Headings}>
          <Text style={styles.Heading}>
            {fromLang === "en" ? "English" : "Sinhala"}
          </Text>
          <Pressable onPress={swapLanguages}>
            <AntDesign name="swap" size={24} color="black" />
          </Pressable>
          <Text style={styles.Heading}>
            {toLang === "si" ? "Sinhala" : "English"}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.additionalInput}
            placeholder="Enter Text"
            placeholderTextColor="#aaaaaa"
            onChangeText={handleTextChange}
            value={enteredtext}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
          />
          <View style={styles.btn}>
            {enteredtext && (
              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => speak(enteredtext)}
              >
                <AntDesign name="sound" size={24} color="#0288D1" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading && <Text>Loading...</Text>}
        {error && <Text>Error: {error}</Text>}

        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.suggestionItem}>
              <View style={styles.result}>
                <Text style={styles.proverbText}>
                  {fromLang === "en"
                    ? `${item.sinhaleseProverb} `
                    : item.englishTranslation}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      fromLang === "en"
                        ? item.sinhaleseProverb
                        : item.englishTranslation
                    )
                  }
                >
                  <AntDesign name="copy1" size={20} color="#0288D1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.translationText1}>
                {fromLang === "en"
                  ? item.englishTranslation
                  : item.sinhaleseProverb}
              </Text>
              <Text style={styles.translationText2}>
                {fromLang === "en"
                  ? `${item.singlishMeaning}`
                  : item.singlishMeaning}
              </Text>
            </View>
          )}
        />
      </View>
      <>
      <Toast />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "column",
    width: "90%",
    alignItems: "stretch",
    marginHorizontal: 5,
    alignSelf: "center",
  },
  formContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    alignItems: "stretch",
  },
  Headings: {
    flexDirection: "row",
    padding: 20,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  Heading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    marginBottom: 10,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  additionalInput: {
    width: "100%",
    minHeight: 100,
    color: "#000000",
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  result: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  btn: {
    marginBottom: 10,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  
  speakButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    marginLeft: 'auto',   
    alignSelf: 'center',   
  }, 
  suggestionItem: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    flexDirection: "column",
    width: "100%",
    marginBottom: 10,
  },
  proverbText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  translationText1: {
    fontSize: 18,
    color: "#555",
    marginVertical: 5,
  },
  translationText2: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
});
