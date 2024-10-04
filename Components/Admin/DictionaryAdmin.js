import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { RetrieveAllCWords, DeleteCword } from '../../utils/actions-proverbs/Cultural_words';
import debounce from 'lodash.debounce';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

export default function DictionaryAdmin({ navigation }) {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState('Cultural');

  const fetchWords = async () => {
    try {
      const data = await RetrieveAllCWords();
      const wordsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      wordsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setWords(wordsList);
      setFilteredWords(wordsList);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWords();
    }, [])
  );

  const debouncedFilterWords = useCallback(
    debounce(() => {
      const filtered = words.filter(word => {
        return searchQuery
          ? word.headings.some(heading => heading.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
      }).filter(word => {
        return selectedOption === 'Cultural' ? word.headings[0] === 'Cultural' : word.headings[0] === 'Numbers';
      });
      setFilteredWords(filtered);
    }, 300),
    [words, searchQuery, selectedOption]
  );

  useEffect(() => {
    debouncedFilterWords();
  }, [searchQuery, debouncedFilterWords, selectedOption]);

  const deleteWord = async (id) => {
    try {
      await DeleteCword(id);
      setWords(prevWords => prevWords.filter(word => word.id !== id));
      setFilteredWords(prevFiltered => prevFiltered.filter(word => word.id !== id));
      console.log('Word deleted successfully');
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('Details', { item: item });
  };

  return (
    <View style={styles.PageContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder='Search words'
        placeholderTextColor='#aaaaaa'
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Cultural" value="Cultural" />
        <Picker.Item label="Numbers" value="Numbers" />
      </Picker>

      <FlatList
        data={filteredWords}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.innerContainer}>
              {item.headings && item.headings.length > 1 && item.headings.slice(1).map((heading, index) => (
                <Text key={index} style={styles.itemHeading}>
                  {heading}
                </Text>
              ))}
            </View>
            <View style={styles.actions}>
              <FontAwesome
                name='trash'
                color='red'
                onPress={() => deleteWord(item.id)}
                style={styles.deletebtn}
              />
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddWord')}>
        <Ionicons name="add-circle-outline" size={50} color= 'black' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  PageContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    borderWidth: 2,
    borderColor: '#888',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  itemHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletebtn: {
    fontSize: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    tintColor:'#fff',
    borderRadius: 50,
    padding: 1,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
