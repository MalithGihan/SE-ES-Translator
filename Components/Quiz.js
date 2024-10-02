import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useContext } from "react";
import { ThemeContext } from "./SettingsContext";

export default Quiz = ({navigation}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <View style={[
      {
        backgroundColor: isDarkMode ? "#000" : "#E9E3E6",
      },
    ]}>
      <Text>Quiz</Text>
    </View>
  )
}


const styles = StyleSheet.create({})