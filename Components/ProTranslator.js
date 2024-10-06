import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { getProverbs } from "../utils/actions-proverbs/proverbAction";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { ThemeContext } from "./SettingsContext";

export default ProTranslator = (navigate) => {
  const [proverbs, setProverbs] = useState([]);
  const [enteredtext, setenteredtext] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("si");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

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
        type: "success",
        text1: "Copied!",
        text2: "Translation copied to clipboard!",
        position: "bottom",
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
          proverb.singlishMeaning.toLowerCase().includes(text.toLowerCase()) ||
          proverb.type.toLowerCase().includes(text.toLowerCase())   
      );
    }

    setSuggestions(filteredProverbs);
  };

  return (
    <View
      style={[
        styles.page,
        { backgroundColor: isDarkMode ? "#000" : "#E9E3E6" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headertit,
            { color: isDarkMode ? "white" : "#736F72" },
          ]}
        >
          Pro Translator
        </Text>

        <Image
          source={
            isDarkMode
              ? require("../assets/images/Untitled-1.png")
              : require("../assets/images/blck logo2.png")
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.Headings}>
          <Text
            style={[
              styles.Heading,
              { color: isDarkMode ? "white" : "#736F72" },
            ]}
          >
            {fromLang === "en" ? "English" : "සිංහල"}
          </Text>
          <Pressable onPress={swapLanguages}>
            <AntDesign
              name="swap"
              size={24}
              color={isDarkMode ? "white" : "#736F72"}
            />
          </Pressable>
          <Text
            style={[
              styles.Heading,
              { color: isDarkMode ? "white" : "#736F72" },
            ]}
          >
            {toLang === "si" ? "සිංහල" : "English"}
          </Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "#8a8a8a" : "#736F72",
              borderColor: isDarkMode ? "#8a8a8a" : "#fff",
            },
          ]}
        >
          <TextInput
            style={[
              styles.additionalInput,
              {
                backgroundColor: isDarkMode ? "#8a8a8a" : "#736F72",
                color: isDarkMode ? "white" : "#E9E3E6",
              },
            ]}
            placeholder="Enter Text"
            placeholderTextColor={isDarkMode ? "#ffffff" : "#E9E3E6"}
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
                <AntDesign name="sound" size={24} color="#fff" />
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
            <View
              style={[
                styles.suggestionItem,
                {
                  backgroundColor: isDarkMode ? "#454545" : "#B2B2B2",
                  borderColor: isDarkMode ? "#454545" : "#736F72",
                },
              ]}
            >
              <View style={styles.result}>
                <Text
                  style={[
                    styles.proverbText,
                    { color: isDarkMode ? "white" : "#fff" },
                  ]}
                >
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
              <Text
                style={[
                  styles.translationText1,
                  { color: isDarkMode ? "#B2B2B2" : "#fff" },
                ]}
              >
                {fromLang === "en"
                  ? item.englishTranslation
                  : item.sinhaleseProverb}
              </Text>
              <Text
                style={[
                  styles.translationText2,
                  { color: isDarkMode ? "#B2B2B2" : "#fff" },
                ]}
              >
                {fromLang === "en"
                  ? `${item.singlishMeaning}`
                  : item.singlishMeaning}
              </Text>
              <Text
                style={[
                  styles.meaningText2,
                  { color: isDarkMode ? "#B2B2B2" : "#fff" },
                ]}
              >
                {fromLang === "en"
                  ? `${item.type}`
                  : item.type}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 300 }} 
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
    width: "100%",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 20,
  },
  headertit: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 5,
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
    paddingTop: 15,
  },
  result: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  btn: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
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
  speakButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    marginLeft: "auto",
    alignSelf: "center",
  },
  suggestionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderRadius: 10,
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
