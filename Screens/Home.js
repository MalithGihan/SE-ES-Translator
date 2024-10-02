import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Pressable,
  TextInput,
  Image
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
  const [language, setLanguage] = useState("en");

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("@viewedOnboarding");

      console.log("Meka wada")

      Alert.alert(
        language === "en" ? "Onboarding cleared" : "ඔබගේ මූලික පිටු මකා ඇත",
        language === "en"
          ? "You will see the onboarding screens again when you restart the app."
          : "ඔබ යෙදුම නැවත ආරම්භ කරන විට නැවත මූලික පිටු දක්නට ලැබේ."
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
        settranslatedtext(
          language === "en" ? "No translation found." : "පරිවර්තනයක් හමු නොවීය."
        );
      }
    } catch (error) {
      console.error("Error fetching translation:", error);
      settranslatedtext(
        language === "en"
          ? "Error fetching translation."
          : "පරිවර්තනය ලබා ගැනීමේ දෝෂයකි."
      );
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
      Alert.alert(
        language === "en" ? "Copied" : "පිටපත් කර ඇත",
        language === "en"
          ? "Translation copied to clipboard!"
          : "පරිවර්තනය පසුරු පුවරුවට පිටපත් කර ඇත!"
      );
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "si" : "en"));
  };

  return (
    <View style={styles.container}>
    
      <Image 
          source={require('../assets/images/Untitled-1.png')} 
          style={styles.leftCorner}
          resizeMode="contain" 
        />


      <View style={styles.rightCorner}>
        <CommonNavBtn
          title={language === "en" ? "Sign In" : "ඇතුල් වන්න"}
          onPress={() => navigation.navigate("Welcome")}
          style={{
            marginHorizontal: 8,
            backgroundColor: "white",
            borderColor: "white",
          }}
        />
      </View>

      {loading && <Text></Text>}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.formContainer}>
        <View style={styles.Headings}>
          <Text style={styles.Heading}>
            {fromLang === "en" ? "English" : "සිංහල "}
          </Text>
          <Pressable onPress={swapLanguages}>
            <AntDesign name="swap" size={24} color="white" />
          </Pressable>
          <Text style={styles.Heading}>
            {toLang === "si" ? "සිංහල " : "English"}
          </Text>
        </View>
        <View style={styles.commenarea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.additionalInput}
              placeholder={language === "en" ? "Enter Text" : "පෙළ ඇතුල් කරන්න"}
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
                  color={enteredtext ? "#fff" : "#aaaaaa"}
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
                    color={enteredtext ? "#fff" : "#aaaaaa"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.additionalInput}
              placeholder={language === "en" ? "Translation" : "පරිවර්තනය"}
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
                color={translatedtext ? "#fff" : "#aaaaaa"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttom}>
      <View style={styles.centeredButton}>
        <CommonNavBtn
          title={
            language === "en" ? "Clear Onboarding" : "මුලික වින්‍යාස ඉවත් කරන්න"
          }
          onPress={clearOnboarding}
          style={{ backgroundColor: "white", borderColor: "white" }}
        />
      </View>

      <View style={styles.centeredButton2}>
        <TouchableOpacity onPress={toggleLanguage} style={styles.botBtn}>
          {language === "en" ? (
            <Ionicons name="language" size={24} color="white" />
          ) : (
            <Ionicons name="globe-outline" size={24} color="white" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Appintro")}
          style={styles.botBtn}
        >
          <AntDesign name="questioncircleo" size={24} color="white" />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#000",
  },
  leftCorner: {
    position:'relative',
    left: 20,
    zIndex: 1,
    width:'30%',
    height:'10%'
  },
  rightCorner: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  buttom:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:10,
    marginBottom:5
  },
  centeredButton: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    bottom:10,
  },
  centeredButton2: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 10,
    right:5
  },
  botBtn: {
    marginLeft: 20,
  },
  text: {
    fontSize: 24,
    marginTop: 8,
    fontWeight: "bold",
    color: "white",
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
  },
  Heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  commenarea: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#676767",
  },
  additionalInput: {
    width: "100%",
    color: "#fff",
    backgroundColor: "#676767",
    paddingTop: 15,
  },
  paste: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  speakButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  btn: {
    marginTop: 40,
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  logo:{
    position: 'absolute', 
    bottom: 0,             
    left: 0,                      
    opacity: 0.5,   
   },
});
