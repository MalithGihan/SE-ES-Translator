import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import { ThemeContext } from "./SettingsContext";


export default Translator = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enteredtext, setenteredtext] = useState("");
  const [translatedtext, settranslatedtext] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("si");
  const { isDarkMode } = useContext(ThemeContext);

  const onSubmit = async () => {
    try {
      const response = await axios.request({
        method: "GET",
        url: "https://nlp-translation.p.rapidapi.com/v1/translate",
        params: {
          text: enteredtext,
          to: toLang,
          from: fromLang,
        },
        headers: {
          "x-rapidapi-key": "your-rapidapi-key-here",
          "x-rapidapi-host": "nlp-translation.p.rapidapi.com",
        },
      });

      if (response && response.data && response.data.translated_text) {
        settranslatedtext(response.data.translated_text[toLang]);
      } else {
        settranslatedtext("No translation found.");
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      settranslatedtext("Error fetching translation.");
    }
  };

  const swapLanguages = () => {
    setFromLang((prev) => (prev === "en" ? "si" : "en"));
    setToLang((prev) => (prev === "si" ? "en" : "si"));
    setenteredtext("");
    settranslatedtext("");
  };

  const speak = (text) => {
    Speech.speak(text, {
      language: fromLang === "en" ? "en" : "si",
    });
  };
  const copyToClipboard = async () => {
    if (translatedtext) {
      await Clipboard.setStringAsync(translatedtext);
      Alert.alert("Copied", "Translation copied to clipboard!");
    }
  };

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: isDarkMode ? "black" : "#fff",
          color: isDarkMode ? "white" : "black",
        },
      ]}
    >
      {loading && <Text></Text>}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.formContainer}>
        <Text
          style={[styles.header, { color: isDarkMode ? "white" : "black" }]}
        >
          Profile
        </Text>
        <View style={styles.Headings}>
          <Text
            style={[styles.Heading, { color: isDarkMode ? "white" : "black" }]}
          >
            {fromLang === "en" ? "English" : "Sinhala"}
          </Text>
          <Pressable onPress={swapLanguages}>
            <AntDesign
              name="swap"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </Pressable>
          <Text
            style={[styles.Heading, { color: isDarkMode ? "white" : "black" }]}
          >
            {toLang === "si" ? "Sinhala" : "English"}
          </Text>
        </View>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "black" : "#fff",
              borderColor: isDarkMode ? "white" : "black",
            },
          ]}
        >
          <TextInput
            style={[
              styles.additionalInput,
              {
                backgroundColor: isDarkMode ? "black" : "#fff",
              },
            ]}
            placeholder="Enter Text"
            placeholderTextColor="#aaaaaa"
            onChangeText={setenteredtext}
            value={enteredtext}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            textAlignVertical="top"
          />
          <View style={styles.btn}>
            <TouchableOpacity
              onPress={onSubmit}
              style={styles.speakButton}
              disabled={!enteredtext}
            >
              <Ionicons
                name="send"
                size={24}
                color={enteredtext ? "white" : "#aaaaaa"}
              />
            </TouchableOpacity>
            {toLang !== "en" && (
              <TouchableOpacity
                style={styles.speakButton}
                onPress={() => speak(enteredtext)}
                disabled={!enteredtext}
              >
                <AntDesign
                  name="sound"
                  size={24}
                  color={
                    translatedtext
                      ? isDarkMode
                        ? "white"
                        : "#0288D1"
                      : isDarkMode
                      ? "#aaaaaa"
                      : "black"
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDarkMode ? "black" : "#fff",
              borderColor: isDarkMode ? "white" : "black",
            },
          ]}
        >
          <TextInput
            style={[
              styles.additionalInput,
              {
                backgroundColor: isDarkMode ? "black" : "#fff",
              },
            ]}
            placeholder="Translation"
            placeholderTextColor="#aaaaaa"
            onChangeText={settranslatedtext}
            value={translatedtext}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            editable={false}
            multiline={true}
            textAlignVertical="top"
          />
          <View  style={styles.btn2}>
          <TouchableOpacity
            style={styles.speakButton}
            onPress={copyToClipboard}
            disabled={!translatedtext}
          >   
            <AntDesign
              name="copy1"
              size={24}     
              color={
                translatedtext
                  ? isDarkMode
                    ? "white"
                    : "#0288D1"
                  : isDarkMode
                  ? "#aaaaaa"
                  : "black"
              }
            />   
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 15 
  },
  header: {
    fontSize: 25,
    textAlign: "left",
    marginLeft: 5,
    fontWeight: "bold",
  },
  Headings: {
    flexDirection: "row",
    padding: 20,
    width: "100%", 
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  Heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 15,
    marginVertical:10
  },
  additionalInput: {
    width: "100%",
    minHeight: 100,
    borderRadius: 15,
    padding: 10,
  },
  speakButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btn: {
    marginBottom: 10,
    gap: 8,
    paddingHorizontal:10,
    flexDirection: "row",
    justifyContent:'flex-end'
  },
  btn2: {
    marginBottom: 10,
    gap: 8,
    paddingHorizontal:10,
    flexDirection: "row",
    justifyContent:'flex-end'
  },
});
