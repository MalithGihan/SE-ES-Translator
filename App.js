import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "./OnBoarding/Onboarding";
import Home from "./Screens/Home";
import SignIn from "./Screens/Login/SignIn";
import Welcome from "./Screens/Login/Welcome";
import SignUp from "./Screens/Login/SignUp";
import OnboardingContext from "./OnBoarding/OnboardingContext"; 
import { Provider } from "react-redux";
import { store } from "./store/store";
import HomeUser from "./Screens/HomeUser";
import HomeAdmin from "./Screens/HomeAdmin";
import { SettingsProvider } from "./Components/SettingsContext";
import Appintro from "./Components/Appintro";

const Stack = createStackNavigator();

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" />
  </View>
);

const OnboardingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={Onboarding} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="HomeUser" component={HomeUser} />
      <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
      <Stack.Screen name="Appintro" component={Appintro} />
    </Stack.Navigator>
  </Provider>
);

export default function App() {
  const [loading, setLoading] = useState(true);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("@viewedOnboarding");
      if (value !== null) {
        setViewedOnboarding(true);
      }
    } catch (err) {
      console.log("Error @checkOnboarding:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <OnboardingContext.Provider value={{ viewedOnboarding, setViewedOnboarding }}>
      <SettingsProvider> 
        <StatusBar style="auto" />
        <NavigationContainer>
          {!viewedOnboarding ? <OnboardingStack /> : <MainStack />}
        </NavigationContainer>
      </SettingsProvider>
    </OnboardingContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
