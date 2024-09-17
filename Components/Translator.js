import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";

export default Translator = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enteredtext, setenteredtext] = useState("");
  const [translatedtext, settranslatedtext] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("si");

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
          "x-rapidapi-key":
            "4e1aa0bf4emsh14488fc7aa3851ap1a384ejsn2d1c01fccbd3",
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
    <View style={styles.page}>
      {loading && <Text></Text>}
      {error && <Text>Error: {error}</Text>}
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
                color={enteredtext ? "#0288D1" : "#aaaaaa"}
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
                  color={enteredtext ? "#0288D1" : "#aaaaaa"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.additionalInput}
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
          <TouchableOpacity
            style={styles.speakButton}
            onPress={copyToClipboard}
            disabled={!translatedtext}
          >
            <AntDesign
              name="copy1"
              size={24}
              color={translatedtext ? "#0288D1" : "#aaaaaa"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  formContainer: {
    flexDirection: "column",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  Headings: {
    flexDirection: "row",
    padding: 20,
    width: 400,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  Heading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  inputContainer: {
    width: 400,
    flexDirection: "column",
    alignItems: "flex-end",
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: "#000",
  },
  button: {
    height: 50,
    width: 80,
    backgroundColor: "#0288D1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    height: 50,
    width: 150,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },

  container: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  additionalInput: {
    width: "100%",
    minHeight: 100,
    color: "#000000",
    backgroundColor: "#fff",
    paddingTop: 15,
  },

  speakButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btn: {
    marginBottom: 10,
    marginRight: -3,
    gap: 8,
    flexDirection: "row",
  },
});
