  import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
  import React from 'react'
  import { useNavigation } from '@react-navigation/native';
  
  const DictionaryAdmin = () => {
  
      const navigation = useNavigation();
  
  
      return (
          <View style={styles.PageContainer}>
              <View style={styles.Grids}>
                  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Translation_Management_Page')}>
                      <Text style={styles.addButtonText}>Translation Management</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Report')}>
                      <Text style={styles.addButtonText}>Reporting & Analysing</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )
  }
  
  export default DictionaryAdmin
  
  const styles = StyleSheet.create({
      PageContainer: {
          flex:1,
          flexDirection:'column',
          backgroundColor:'#bfdad9',
         justifyContent:'center',
          
      },
      addButton: {
          height: 150,
          width: 150,
          backgroundColor: '#8dbdbb',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10, 
          marginTop: 10,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 2,
          borderWidth: 1, 
          borderColor: 'rgba(255, 255, 255, 0.5)', 
      },
      addButtonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
      },
      Grids: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems:'center'
          
      }
  })