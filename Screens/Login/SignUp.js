import React, { useReducer, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CommonNavBtn from "../../Components/CommonNavBtn";
import AntDesign from "react-native-vector-icons/AntDesign";
import { signUp } from "../../utils/actions/authActions";


const initialState = {
  inputValues: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  },
  formIsValid: false,
};

const reducer = (state, action) => {
  const { validationResult, inputId, inputValue } = action;

  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
  };

  let updatedFormIsValid = true;
  for (const key in updatedValidities) {
    if (updatedValidities[key] !== true) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};

const SignUp = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validateInput = (inputId, inputValue) => {
    switch (inputId) {
      case "fullName":
        return inputValue.trim().length > 0 ? true : "Name is required";
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputValue) ? true : "Invalid email format";
      case "password":
        return inputValue.length >= 6
          ? true
          : "Password must be at least 6 characters";
      case "confirmPassword":
        return inputValue.length >= 6 ? true : "Please confirm your password";
      default:
        return true;
    }
  };

  const inputChangedHandler = useCallback((inputId, inputValue) => {
    const validationResult = validateInput(inputId, inputValue);
    dispatchFormState({
      inputId,
      validationResult: validationResult || null,
      inputValue,
    });
  }, []);

  const authHandler = async () => {
    const role = "user";

    try {
      if (
        formState.inputValues.password !== formState.inputValues.confirmPassword
      ) {
        Alert.alert('Passwords do not match!');
      }

      setIsLoading(true);
      const action = signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.password,
        role
      );

      await dispatch(action);
      setError(null);
      Alert.alert("Account Successfully created", "Account created");
      setIsLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred", error);
    }
  }, [error]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Image
        source={require("../../assets/images/Untitled-1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <ScrollView style={{ flex: 1, backgroundColor: "black", padding: 16 }}>
        <Text
          style={{
            color: "white",
            fontSize: 37,
            fontWeight: "700",
            marginVertical: 10,
            marginTop: 100,
          }}
        >
          Sign Up
        </Text>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "400" }}>
          Signup now for free and start learning, and explore language.
        </Text>
        <View style={{ marginVertical: 22 }}>
          <CustomInput
            id="fullName"
            value={formState.inputValues.fullName}
            placeholder="Name"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.fullName || null}
            onInputChanged={inputChangedHandler}
          />
          <CustomInput
            id="email"
            value={formState.inputValues.email}
            placeholder="Email Address"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.email || null}
            onInputChanged={inputChangedHandler}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomInput
                id="password"
                value={formState.inputValues.password}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry={!isPasswordVisible}
                errorText={formState.inputValidities.password || null}
                onInputChanged={inputChangedHandler}
                style={{ width: "100%" }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}
              style={{ position: "absolute", right: 15, top: 25 }}
            >
              <AntDesign
                name={isPasswordVisible ? "eye" : "eyeo"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomInput
                id="confirmPassword"
                value={formState.inputValues.confirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="gray"
                secureTextEntry={!isConfirmPasswordVisible}
                errorText={formState.inputValidities.confirmPassword || null}
                onInputChanged={inputChangedHandler}
                style={{ width: "100%" }}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                setConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              style={{ position: "absolute", right: 15, top: 25 }}
            >
              <AntDesign
                name={isConfirmPasswordVisible ? "eye" : "eyeo"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Sign Up"
            onPress={authHandler}
            isLoading={isLoading}
            style={{
              margin: 10,
              backgroundColor: "white",
              borderColor: "white",
            }}
          />

          <View style={styles.bottomConatiner}>
            <Text style={{ fontSize: 12, color: "white", fontWeight: "400" }}>
              Have an account already?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "white" }}>
                {" "}
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.centeredButton}>
        <CommonNavBtn
          title="Home"
          onPress={() => navigation.navigate("Home")}
          style={{ backgroundColor: "white", borderColor: "white" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomConatiner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  centeredButton: {
    bottom: 10,
    left: 20,
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
  logo: {
    width: "40%",
    position: "absolute",
    top: -150,
    right: 20,
    opacity: 0.5,
    transform: [{ rotate: "0deg" }],
    zIndex: 1,
  },
});
export default SignUp;
