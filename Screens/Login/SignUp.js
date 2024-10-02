import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useCallback, useReducer, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signUp } from "../../utils/actions/authActions";

const isTestMode = true;

const initialState = {
  inputValues: {
    fullName: "",
    email: "",
    password: "",
    role: "user",
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

// Make sure to declare the function as a constant function expression.
const SignUp = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue); // Pass ID and value
      dispatchFormState({
        inputId,
        validationResult: result || null,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    const role = "user";

    try {
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
      Alert.alert("An error occured", error);
    }
  }, [error]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
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
            value={formState.inputValues.fullName} // Pass value from state
            placeholder="Name"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.fullName} // Pass error message
            onInputChanged={inputChangedHandler}
          />
          <CustomInput
            id="email"
            value={formState.inputValues.email} // Controlled value
            placeholder="Email Address"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.email} // Pass error message
            onInputChanged={inputChangedHandler}
          />
          <CustomInput
            id="password"
            value={formState.inputValues.password} // Controlled value
            placeholder="Password"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.password} // Pass error message
            onInputChanged={inputChangedHandler}
          />
          <CustomButton
            title="Sign Up"
            onPress={authHandler}
            isLoading={isLoading}
            style={{ margin: 10, backgroundColor: "white",borderColor: "white"  }}
          />

          <View style={styles.bottomConatiner}>
            <Text style={{ fontSize: 12, color: "white", fontWeight:'400' }}>
              Have an account already ?
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
      <Image
        source={require("../../assets/images/Untitled-1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.centeredButton}>
        <CommonNavBtn
          title="Home"
          onPress={() => navigation.navigate("Home")}
          style={{ backgroundColor: "white",borderColor: "white"  }}
        />
      </View>
    </View>
  );
};

export default SignUp;

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
    flex: -1,
    width: "200%",
    position: "absolute",
    bottom: -100,
    left: 20,
    opacity: 0.5,
    transform: [{ rotate: "2500deg" }],
  },
});
