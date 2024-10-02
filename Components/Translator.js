import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  Image,
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
          backgroundColor: isDarkMode ? "#000" : "#E9E3E6",
        },
      ]}
    >
      {loading && <Text></Text>}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.formContainer}>
        <View style={styles.header}>
          <Text
            style={[
              styles.headertit,
              { color: isDarkMode ? "white" : "#736F72" },
            ]}
          >
            Translator
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

        <View style={styles.Headings}>
          <Text
            style={[styles.Heading, { color: isDarkMode ? "white" : "#736F72" }]}
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
            style={[styles.Heading, { color: isDarkMode ? "white" : "#736F72" }]}
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
                color: isDarkMode ? "white" : "#E9E3E6"
              },
            ]}
            placeholder="Enter Text"
            placeholderTextColor={isDarkMode ? "#ffffff" : "#E9E3E6"} 
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
                color={
                  enteredtext
                    ? isDarkMode
                      ? "#ffffff" 
                      : "#ffffff" 
                    : "#aaaaaa"
                }
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
                        : "#fff"
                      : isDarkMode
                      ? "#aaaaaa"
                      : "#fff"
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
              backgroundColor: isDarkMode ? "#454545" : "#B2B2B2",
              borderColor: isDarkMode ? "#454545" : "#736F72",
            },
          ]}
        >
          <TextInput
            style={[
              styles.additionalInput,
              {
                backgroundColor: isDarkMode ? "#454545" : "#B2B2B2",
                color: isDarkMode ? "white" : "#fff"
              },
            ]}
            placeholder="Translation"
            placeholderTextColor={isDarkMode ? "#ffffff" : "#736F72"} 
            onChangeText={settranslatedtext}
            value={translatedtext}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            editable={false}
            multiline={true}
            textAlignVertical="top"
          />
          <View style={styles.btn2}>
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
                    : "#fff"
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
    paddingHorizontal: 15,
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
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 15,
    marginVertical: 10,
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
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn2: {
    marginBottom: 10,
    gap: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
