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
        searchInRetrievedData(translatedText);
      } else {
        setAdditionalInput2('No translation found.');
        setFilteredWords([]);
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      setAdditionalInput2('Error fetching translation.');
      setFilteredWords([]);
    }
  };

  const searchInRetrievedData = (text) => {
    const filtered = words.filter(word => 
      word.headings && word.headings.some(heading => 
        heading.toLowerCase().includes(text.toLowerCase())
      )
    );
    setFilteredWords(filtered);
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
          numColumns={1}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View>
                <View style={styles.innerContainer}>
                  {item.headings && item.headings.map((heading, index) => (
                    <Text key={index} style={styles.itemHeading}>
                      {heading}
                    </Text>
                  ))}
                </View>
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
    page:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'#bfdad9',
        alignItems:'center',
        
    },
    formContainer: {
        flexDirection: 'column',
        padding: 10,
       
        justifyContent: 'center',
        alignItems: 'center',
    },
    Headings: {
        flexDirection: 'row',
        padding: 20,
        width: 400,
        justifyContent: 'space-evenly',
        alignItems: 'center'

    },
    Heading: {
        fontSize: 15,
        fontWeight: 'bold',

    },
    inputContainer: {
        width:400,
         flexDirection: 'column',
         alignItems: 'flex-end',
         marginBottom: 10,
         borderColor: '#888',
         borderWidth: 1,
         borderRadius: 5,
         paddingHorizontal: 10,
         marginTop:20,
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
        flexDirection: 'row',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
   
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    itemHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    additionalInput: {
        width: '100%',
        minHeight: 100,
        color:'#000000',
        backgroundColor: '#fff',
        paddingTop:15
    },
    speakButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    msg:{
        flexDirection:"row",
        justifyContent:'center'
    },
    btn:{
        marginBottom:10,
        marginRight:-3,
        gap:8,
        flexDirection:'row'
    }
});