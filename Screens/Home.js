import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CommonNavBtn from "../Components/CommonNavBtn";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";

export default function Home() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enteredtext, setenteredtext] = useState("");
  const [translatedtext, settranslatedtext] = useState("");
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("si");

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
    <View style={styles.container}>
      <View style={styles.leftCorner}>
        <Text style={styles.text}>Home</Text>
      </View>

      <View style={styles.rightCorner}>
        <CommonNavBtn
          title="Sign In"
          onPress={() => navigation.navigate("Welcome")}
          style={{ marginVertical: 8 }}
        />
      </View>

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
        <View style={styles.commenarea}>
          <View  style={styles.inputContainer}>
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
              style={styles.paste}
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

      <View style={styles.centeredButton}>
        <CommonNavBtn
          title="Clear Onboarding"
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
    padding: 10,
  },
  leftCorner: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  rightCorner: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  centeredButton: {
    position:'absolute',
    bottom:20,
    left:20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  Headings: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    marginTop: 50,
  },
  Heading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commenarea:{
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  additionalInput: {
    width: "100%",
    color: "#000000",
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  paste:{
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: "flex-end",
  },
  speakButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    marginTop:40,
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
});
