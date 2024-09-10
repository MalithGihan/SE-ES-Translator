import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProTranslatorAdmin from '../Components/Admin/ProTranslatorAdmin';
import DictionaryAdmin from '../Components/Admin/DictionaryAdmin';
import Profile from '../Components/Profile';

const proTranslatorAdminScreen = 'ProTranslatorAdmin';
const dictionaryAdminScreen = 'DictionaryAdmin';
const profileScreen = 'Profile';

const Tab = createBottomTabNavigator();

export default function HomeAdmin() {
  return (
    <Tab.Navigator
      initialRouteName={proTranslatorAdminScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === proTranslatorAdminScreen) {
            iconName = focused ? 'language' : 'language-outline';
          } else if (route.name === dictionaryAdminScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === profileScreen) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false, 
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'rgba(128, 128, 128, 0.5)',
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen name={proTranslatorAdminScreen} component={ProTranslatorAdmin} />
      <Tab.Screen name={dictionaryAdminScreen} component={DictionaryAdmin} />
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