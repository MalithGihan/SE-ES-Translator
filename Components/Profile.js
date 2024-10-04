import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { ThemeContext } from "./SettingsContext";
import CustomButton from "../Screens/Login/CustomButton";
import { logout } from "../utils/actions/authActions";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

export default Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      await logout(dispatch, navigation);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigateToEditUser = () => {
    navigation.navigate("Edituser");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? "#000" : "#E9E3E6",
        },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={
            isDarkMode
              ? require("../assets/images/Untitled-1.png")
              : require("../assets/images/blck logo2.png")
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.container2}>
        <Text
          style={[styles.title, { color: isDarkMode ? "white" : "#736F72" }]}
        >
          Welcome {userData && userData.fullName ? userData.fullName : "User"}
        </Text>
        {userData ? (
          <View
            style={[
              styles.info,
              { backgroundColor: isDarkMode ? "#8a8a8a" : "#736F72" },
            ]}
          >
            <TouchableOpacity onPress={navigateToEditUser} style={{position:'relative',flexDirection:'row',justifyContent:'flex-end'}}>
              <Icon
                name="edit"
                size={25}
                color={isDarkMode ? "#00ffcc" : "#fff"}
              />
            </TouchableOpacity>
            <Text
              style={[styles.text1, { color: isDarkMode ? "white" : "white" }]}
            >
              {userData.fullName}
            </Text>
            <Text
              style={[styles.text, { color: isDarkMode ? "white" : "white" }]}
            >
              User Role: {userData.role}
            </Text>
            <Text
              style={[styles.text, { color: isDarkMode ? "white" : "white" }]}
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
      </View>

      <View style={styles.bottom}>
        <CustomButton
          title="Sign Out"
          onPress={handleLogout}
          style={{
            marginVertical: 8,
            marginHorizontal: 20,
            bottom: 100,
            backgroundColor: "white",
          }}
          borderColor={isDarkMode ? "white" : "white"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 40,
    marginBottom: 20,
  },
  headertit: {
    fontSize: 25,
    fontWeight: "900",
    marginLeft: 5,
  },
  info: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
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
    marginHorizontal: 5,
  },
  setting1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginHorizontal: 10,
  },
  bottom: {
    bottom: 10,
    marginBottom: 20,
  },
});
