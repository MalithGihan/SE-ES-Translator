import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Translator from '../Components/Translator';
import ProTranslator from '../Components/ProTranslator';
import Dictionary from '../Components/Dictionary';
import Quiz from '../Components/Quiz';
import Profile from '../Components/Profile';
import { ThemeContext } from '../Components/SettingsContext'
import Edituser from './Login/Edituser';

const translatorScreen = 'Translator';
const proTranslatorScreen = 'ProTranslator';
const profileScreen = 'Profile';
const dictionaryScreen = 'Dictionary';
const quizScreen = 'Quiz';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStack() {
  return(
    <Stack.Navigator>
        <Stack.Screen
        name="Profile_"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edituser"
        component={Edituser}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default function HomeUser() {
  const { isDarkMode } = useContext(ThemeContext); 

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
        tabBarShowLabel: false,
        tabBarActiveTintColor: isDarkMode ? 'white' : 'white',  
        tabBarInactiveTintColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(240, 240, 240, 0.5)',  
        tabBarStyle: [
          styles.tabBar, 
          {
            backgroundColor: isDarkMode ? '#333' : '#736F72',  
            shadowColor: isDarkMode ? '#00ffcc' : 'black'        
          }
        ],
        tabBarIconStyle: styles.tabBarIcon,
        headerShown: false,
      })}
    >
      <Tab.Screen name={translatorScreen} component={Translator} />
      <Tab.Screen name={proTranslatorScreen} component={ProTranslator} />
      <Tab.Screen name={dictionaryScreen} component={Dictionary} />
      <Tab.Screen name={quizScreen} component={Quiz} />
      <Tab.Screen name={profileScreen} component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: 60, 
    marginBottom: 20,
    marginHorizontal: 20,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute',
  },
  tabBarIcon: {
    marginBottom: -5,
  },
});
