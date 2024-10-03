import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ProTranslatorAdmin from '../Components/Admin/ProTranslatorAdmin';
import DictionaryAdmin from '../Components/Admin/DictionaryAdmin';
import Translation_Mangementpage from '../Components/Admin/Translation_Mangementpage';
import AddWord from '../Components/Admin/Add_words';
import Details from '../Components/Admin/Details';
import Edit_words from '../Components/Admin/Edit_words';
import Report from '../Components/Admin/Report';
import ProfileAdmin from '../Components/ProfileAdmin';
import ProverbsReport from '../Components/Admin/ProverbsReport';

const proTranslatorAdminScreen = 'ProTranslatorAdmin';
const DictionaryAdminScreen = 'DictionaryAdmin';
const profileAdminScreen = 'ProfileAdmin'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DictionaryAdminStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="DictionaryAdmin"
        component={DictionaryAdmin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Translation_Management_Page"
        component={Translation_Mangementpage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddWord"
        component={AddWord}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Edit_words"
        component={Edit_words}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}

function ProfileAdminStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen
        name="ProfileAdminScreen"
        component={ProfileAdmin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProverbReportScreen"
        component={ProverbsReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Report"
        component={Report}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}


export default function HomeAdmin() {
  return (
    <Tab.Navigator
      initialRouteName={proTranslatorAdminScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === proTranslatorAdminScreen) {
            iconName = focused ? 'language' : 'language-outline';
          } else if (route.name === DictionaryAdminScreen) {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === profileAdminScreen) {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'rgba(128, 128, 128, 0.5)',
        tabBarStyle: styles.tabBar,
        tabBarIconStyle: styles.tabBarIcon,
        headerShown: false,
      })}
    >
      <Tab.Screen name={proTranslatorAdminScreen} component={ProTranslatorAdmin} />
      <Tab.Screen name={DictionaryAdminScreen} component={DictionaryAdminStack} />
      <Tab.Screen name={profileAdminScreen} component={ProfileAdminStack} />
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
