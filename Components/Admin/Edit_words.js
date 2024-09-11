import { View, Text, Button, FlatList, TextInput, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { RetrieveAllCWords, UpdateCword, DeleteCword } from '../../utils/actions-proverbs/Cultural_words'; 
import debounce from 'lodash.debounce';
import { FontAwesome } from '@expo/vector-icons';

export default function Edit_words({ navigation }) {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [newHeading, setNewHeading] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await RetrieveAllCWords();
        const wordsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setWords(wordsList);
        setFilteredWords(wordsList);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, []);

  const debouncedFilterWords = useCallback(debounce(() => {
    const filtered = words.filter(word => {
      return searchQuery
        ? word.headings.some(heading => heading.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
    });
    setFilteredWords(filtered);
  }, 300), [words, searchQuery]);

  useEffect(() => {
    debouncedFilterWords();
  }, [searchQuery, debouncedFilterWords]);

  const handleEdit = (id) => {
    setSelectedWord(id);
    const word = words.find(word => word.id === id);
    if (word) {
      setNewHeading(word.headings.join(', '));
    }
  };

  const deleteWord = (id) => {
    DeleteCword(id).then(() => {
      setWords(prevWords => prevWords.filter(word => word.id !== id));
      setFilteredWords(prevFiltered => prevFiltered.filter(word => word.id !== id));
    }).catch(error => {
      console.error('Error deleting word:', error);
    });
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
      <FlatList
        data={filteredWords}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.innerContainer}>
              {item.headings && item.headings.map((heading, index) => (
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
     
    </View>
  );
}

const styles = StyleSheet.create({
  PageContainer: {
    flex: 1,
    backgroundColor: '#bfdad9',
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
  container: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  editContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 15,
    fontSize: 16,
    color: '#007BFF',
  },
  deletebtn: {
    fontSize: 24,
  },
});