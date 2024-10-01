import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Appintro = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>

      <Text style={styles.topic}>Welcome to App</Text>

      <View style={styles.introSection}>
        <Text style={styles.languageHeading}>English:</Text>
        <Text style={styles.description}>
          Welcome to the Sinhala-English Translator! This app helps you translate text between Sinhala and English effortlessly. Explore proverbs, cultural phrases, and enhance your vocabulary with our quiz feature. Experience seamless translation, learn more about local sayings, and enjoy personalized settings tailored to your preferences.
        </Text>
      </View>

      <View style={styles.introSection}>
        <Text style={styles.languageHeading}>සිංහල:</Text>
        <Text style={styles.description}>
          සිංහල-ඉංග්‍රීසි පරිවර්තකයට සාදරයෙන් පිළිගනිමු! මෙම යෙදුම ඔයාට සිංහල සහ ඉංග්‍රීසි අතර වචන පහසුවෙන් පරිවර්තනය කර ගැනීමට උපකාරී වේ. හුවමාරු කථා, සංස්කෘතික වචන හඳුනා ගනිමින් විශේෂයෙන්ම සකස් කළ විකල්ප සමඟ ඔබගේ පරිසරය මනාව අත්විදින්න.
        </Text>
      </View>
 
      <View style={styles.introSection}>
        <Text style={styles.languageHeading}>தமிழ்:</Text>
        <Text style={styles.description}>
          சிங்கள-ஆங்கில மொழிபெயர்ப்பாளருக்கு வரவேற்கிறோம்! இந்த பயன்பாடு சிங்களம் மற்றும் ஆங்கிலம் இடையே உரைகளை எளிதாக மொழிபெயர்க்க உதவுகிறது. பழமொழிகள் மற்றும் கலாச்சார சொற்றொடர்களைப் புரிந்துகொண்டு, நிதானமாக மொழிபெயர்க்கவும், தனிப்பயன் அமைப்புகளுடன் உங்கள் அனுபவத்தை மேம்படுத்தவும்.
        </Text>
      </View>
      <View style={styles.centeredButton}>
             <CommonNavBtn 
             title='Home'
             onPress={() => navigation.navigate("Home")}
             style={{margin: 10, backgroundColor:'white'}}
          />
       </View>
    </View>
  );
};

export default Appintro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black', 
  },
  topic:{
    fontSize:30,
    fontWeight:'bold',
    marginVertical:20,
    color:'white'
  },
  introSection: {
    marginBottom: 20,
  },
  languageHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15, 
    color:'white'
  },
  description: {
    fontSize: 13,
    color: 'white', 
  },
  centeredButton: {
    flex: 1,
    bottom : 0,
    left : 0,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
});
