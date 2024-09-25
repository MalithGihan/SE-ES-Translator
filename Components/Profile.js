import { StyleSheet, Text, View, Switch } from "react-native";
import React, { useContext } from "react";
import { ThemeContext, LanguageContext } from "./SettingsContext";
import CustomButton from "../Screens/Login/CustomButton";
import { logout } from "../utils/actions/authActions";
import { useSelector, useDispatch } from "react-redux";

export default Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { language, toggleLanguage } = useContext(LanguageContext);

  const handleLogout = async () => {
    try {
      await logout(dispatch, navigation);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? "black" : "#fff"
        },
      ]}
    >
      <View style={styles.container2}>
        <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>
          Welcome {userData && userData.fullName ? userData.fullName : "User"}
        </Text>
        {userData ? (
          <View style={styles.info}>
            <Text
              style={[styles.text1, { color: isDarkMode ? "white" : "black" }]}
            >
              {userData.fullName}
            </Text>
            <Text
              style={[styles.text, { color: isDarkMode ? "white" : "black" }]}
            >
              User Role: {userData.role}
            </Text>
            <Text
              style={[styles.text, { color: isDarkMode ? "white" : "black" }]}
            >
              Email: {userData.email}
            </Text>
          </View>
        ) : (
          <Text style={styles.text}>No user data available</Text>
        )}
      </View>

      <View style={styles.setting}>
        <View style={styles.setting1}>
          <Text
            style={[styles.text, { color: isDarkMode ? "white" : "black" }]}
          >
            Dark Mode
          </Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        {/* <View style={styles.setting1}>
          <Text
            style={[styles.text, { color: isDarkMode ? "white" : "black" }]}
          >
            {language === "en" ? "Change to Sinhala" : "Change to English"}
          </Text>
          <Switch value={language === "si"} onValueChange={toggleLanguage} />
        </View> */}
      </View>

      <CustomButton
        title="Sign Out"
        onPress={handleLogout}
        style={{ marginVertical: 8, marginHorizontal: 20, bottom: 100 }}
        textColor={isDarkMode ? "white" : "black"} 
        borderColor={isDarkMode ? "white" : "black"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
  },
  text1: {
    fontSize: 25,
    marginVertical: 8,
    fontWeight: "bold",
  },
  text: {
    fontSize: 15,
    marginVertical: 8,
    fontWeight: "500",
  },
  setting: {
    top: -350,
    marginHorizontal:5
  },
  setting1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginHorizontal: 10,
  },
});
