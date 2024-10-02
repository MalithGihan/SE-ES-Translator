import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";
import { reducer } from "../../utils/reducers/formReducers";
import { validateInput } from "../../utils/actions/formActions";
import { useDispatch } from "react-redux";
import { signIn } from "../../utils/actions/authActions";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

export default SignIn = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [error, setError] = useState();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result || null,
        inputValue,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    try {
      setIsLoading(true);
      const result = await dispatch(
        signIn(formState.inputValues.email, formState.inputValues.password)
      );
      const { userData } = result;

      setError(null);
      setIsLoading(false);

      // Navigate based on user role
      if (userData.role === "admin") {
        navigation.navigate("HomeAdmin");
      } else {
        navigation.navigate("HomeUser");
      }
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
      <ScrollView style={{ flex: 1, backgroundColor: "black", padding: 16 }}>
        <Text
          style={{
            color: "white",
            fontSize: 37,
            fontWeight: "700",
            marginBottom: 10,
            marginTop: 100,
          }}
        >
          Sign In
        </Text>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "400" }}>
          Sign in now to access your account.
        </Text>
        <View style={{ marginVertical: 22 }}>
          <CustomInput
            id="email"
            value={formState.inputValues.email}
            placeholder="Email Address"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.email}
            onInputChanged={inputChangedHandler}
          />
          <CustomInput
            id="password"
            value={formState.inputValues.password}
            placeholder="Password"
            placeholderTextColor="gray"
            errorText={formState.inputValidities.password}
            onInputChanged={inputChangedHandler}
          />
          <CustomButton
            title="Sign In"
            onPress={authHandler}
            isLoading={isLoading}
            style={{ margin: 10, backgroundColor: "white",borderColor: "white"  }}
          />
          <View style={styles.bottomContainer}>
            <Text style={{ fontSize: 12, color: "white", fontWeight:'400'}}>
              Don't have an Account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "white" }}>
                {" "}
                Sign Up
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

const styles = StyleSheet.create({
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  centeredButton: {
    justifyContent: "flex-end",
    alignItems: "baseline",
    bottom: 10,
    left: 20,
  },
  logo: {
    flex: -1,
    width: "200%",
    position: "absolute",
    bottom: -70,
    left: 20,
    opacity: 0.5,
    transform: [{ rotate: "2500deg" }],
  },
});
