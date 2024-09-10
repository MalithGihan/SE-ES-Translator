import React, { useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, Alert,StyleSheet } from 'react-native';
import { searchProverbs } from '../utils/actions-proverbs/proverbAction'; 

export default ProTranslator = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const searchResults = await searchProverbs(searchText);
      setResults(searchResults);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{ borderColor: '#ddd', borderWidth: 1, marginBottom: 16, padding: 8 }}
        placeholder="Enter search text"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />
      <ScrollView style={{ marginTop: 16 }}>
        {results.map((proverb) => (
          <View key={proverb.id} style={{ marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#ddd' }}>
            <Text>Sinhalese Proverb: {proverb.sinhaleseProverb}</Text>
            <Text>Singlish Meaning: {proverb.singlishMeaning}</Text>
            <Text>English Translation: {proverb.englishTranslation}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
 
});


