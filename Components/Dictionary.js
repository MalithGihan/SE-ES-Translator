import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import * as Speech from 'expo-speech';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { RetrieveAllCWords } from '../utils/actions-proverbs/Cultural_words'

export default Dictionary = () => {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additionalInput1, setAdditionalInput1] = useState('');
  const [additionalInput2, setAdditionalInput2] = useState('');
  const [culturalTranslation, setCulturalTranslation] = useState('');

  const onSubmit = async () => {
    try {
      const response = await axios.request({
        method: 'GET',
        url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
        params: {
          text: additionalInput1,
          to: 'si',
          from: 'en'
        },
        headers: {
          'x-rapidapi-key': '4e1aa0bf4emsh14488fc7aa3851ap1a384ejsn2d1c01fccbd3',
          'x-rapidapi-host': 'nlp-translation.p.rapidapi.com'
        }
      });

      if (response && response.data && response.data.translated_text) {
        const translatedText = response.data.translated_text.si;
        setAdditionalInput2(translatedText);
        const matches = searchInRetrievedData(translatedText);
        const culturalText = combineTranslationWithCulturalWords(translatedText, matches);
        setCulturalTranslation(culturalText);
      } else {
        setAdditionalInput2('No translation found.');
        setFilteredWords([]);
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      setAdditionalInput2('Error fetching translation.');
      setCulturalTranslation('');
      setFilteredWords([]);
    }
  };

  const searchInRetrievedData = (text) => {
    const translatedWords = text.split(' ');
    const matches = words.filter(word =>
      word.headings && translatedWords.some(translatedWord =>
        word.headings[1].toLowerCase() === translatedWord.toLowerCase()
      )
    );
    const filtered = words.filter(word =>
      word.headings && word.headings.some(heading =>
        heading.toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredWords(filtered);
    return matches;
  };

  const combineTranslationWithCulturalWords = (translatedText, matches) => {
    const translatedWords = translatedText.split(' ');
    return translatedWords.map(word => {
      const match = matches.find(m => m.headings[1].toLowerCase() === word.toLowerCase());
      if (match && match.headings[2]) {
        return `${word} (${match.headings[2]})`;
      }
      return word;
    }).join(' ');
  };

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await RetrieveAllCWords();
        const wordsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          createdAt: data[key].createdAt ? new Date(data[key].createdAt) : new Date()
        }));
        setWords(wordsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching words:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const speak = (text) => {
    Speech.speak(text, {
      language: 'en',
    });
  };

  const copyToClipboard = async () => {
    if (additionalInput2) {
      await Clipboard.setStringAsync(additionalInput2);
      Alert.alert("Copied", "Translation copied to clipboard!");
    }
  };

  return (
    <View style={styles.page}>
      {loading && <Text>Loading words...</Text>}
      {error && <Text>Error: {error}</Text>}
      <View style={styles.formContainer}>
        <View style={styles.Headings}>
          <Text style={styles.Heading}>English</Text>
          <AntDesign name="arrowright" size={24} color="black" />
          <Text style={styles.Heading}>Sinhala</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.additionalInput}
            placeholder='Enter Text'
            placeholderTextColor='#aaaaaa'
            onChangeText={setAdditionalInput1}
            value={additionalInput1}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
            multiline={true}
            textAlignVertical='top'
          />
          <View style={styles.btn}>
            <TouchableOpacity
              onPress={onSubmit}
              style={styles.speakButton}
              disabled={!additionalInput1}
            >
              <Ionicons
                name="send"
                size={24}
                color={additionalInput1 ? "#0288D1" : "#aaaaaa"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => speak(additionalInput1)}
              disabled={!additionalInput1}
            >
              <AntDesign
                name="sound"
                size={24}
                color={additionalInput1 ? "#0288D1" : "#aaaaaa"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.additionalInput}
            placeholder='Translation'
            placeholderTextColor='#000000'
            value={additionalInput2}
            underlineColorAndroid='transparent'
            autoCapitalize='none'
            editable={false}
            multiline={true}
            textAlignVertical='top'
          />
          {culturalTranslation && (
            <Text style={styles.culturalTranslation}>{culturalTranslation}</Text>
          )}
          <TouchableOpacity
            style={styles.speakButton}
            onPress={copyToClipboard}
            disabled={!additionalInput2}
          >
            <AntDesign
              name="copy1"
              size={24}
              color={additionalInput2 ? "#0288D1" : "#aaaaaa"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {filteredWords.length > 0 ? (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.innerContainer}>
                {item.headings && item.headings.slice(3, 5).map((heading, index) => (
                  <Text key={index} style={styles.itemHeading}>
                    {index === 1 ? `"${heading}"` : heading}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        additionalInput2 && <Text style={styles.msg}>
          No matching cultural words found!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    marginHorizontal: -30

  },
  formContainer: {
    flexDirection: 'column',
    paddingHorizontal: 0,


    justifyContent: 'center',
    alignItems: 'center',
  },
  Headings: {
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center'

  },
  Heading: {
    fontSize: 15,
    fontWeight: 'bold',

  },
  inputContainer: {
    width: 400,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 10,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: '#000',

  },

  button: {
    height: 50,
    width: 80,
    backgroundColor: '#0288D1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    height: 50,
    width: 150,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },

  container: {
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },

  innerContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  itemHeading: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalInput: {
    width: '100%',
    minHeight: 100,
    color: '#000000',
    backgroundColor: '#fff',
    paddingTop: 15
  },
  speakButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  msg: {
    flexDirection: "row",
    justifyContent: 'center'
  },
  btn: {
    marginBottom: 10,
    marginRight: -3,
    gap: 8,
    flexDirection: 'row'
  },
  culturalTranslation: {
    width: '100%',
    marginTop: 10,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4CAF50',
  },
});