import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useNavigation } from '@react-navigation/native';

export default function Translation_Mangementpage() {
  const navigation = useNavigation();
  return (
    <View style={styles.PageContainer}>
      <View style={styles.Card}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddWord')}>
        <AntDesign name="addfile" size={24} color="black" />
        <Text>Add Word</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Edit_words')}>
        <FontAwesome name="edit" size={24} color="black" />
        <Text>Edit Word</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}
const styles = StyleSheet.create({

  PageContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#bfdad9',
    justifyContent: 'center',
    alignItems:'center'

  },
  Card:{
    flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems:'center',
        gap:30
  },
  addButton: {
    flexDirection: 'row',
    height: 150,
    width: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
    marginTop: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.3)', 
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
})