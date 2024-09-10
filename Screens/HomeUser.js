import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Translator from '../Components/Translator';
import ProTranslator from '../Components/ProTranslator';
import Dictionary from '../Components/Dictionary';
import Quiz from '../Components/Quiz';
import Profile from '../Components/Profile';

const translatorScreen = 'Translator';
const proTranslatorScreen = 'ProTranslator';
const profileScreen = 'Profile';
const dictionaryScreen = 'Dictionary';
const quizScreen = 'Quiz';

const Tab = createBottomTabNavigator();

export default function HomeUser() {
  return (
    <Tab.Navigator
      initialRouteName={translatorScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Define icons based on the screen names
          if (route.name === translatorScreen) {
            iconName = focused ? 'language' : 'language-outline';
          } else if (route.name === proTranslatorScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === profileScreen) {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === dictionaryScreen) {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === quizScreen) {
            iconName = focused ? 'game-controller' : 'game-controller-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false, // Hide the label under the icons
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'rgba(128, 128, 128, 0.5)',
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen name={translatorScreen} component={Translator} />
      <Tab.Screen name={proTranslatorScreen} component={ProTranslator} />
      <Tab.Screen name={dictionaryScreen} component={Dictionary} />
      <Tab.Screen name={quizScreen} component={Quiz} />
      <Tab.Screen name={profileScreen} component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 60, 
    marginBottom:20,
    marginHorizontal:20,
    borderRadius: 50,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabBarIcon: {
    marginBottom: -5,
  },
});
