import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import React, { useReducer, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../utils/actions/authActions';
import { ThemeContext } from "../../Components/SettingsContext";
import CustomButton from './CustomButton';

// Initial state for the form
const initialState = {
  inputValues: {
    fullName: "",
    email: "",
    password: "",
  },
  inputValidities: {
    fullName: false,
    email: false,
    password: false,
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

const Edituser = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  
  const [formState, dispatchFormState] = useReducer(reducer, {
    ...initialState,
    inputValues: {
      fullName: userData.fullName,
      email: userData.email,
      password: '',
    }
  });

  const { isDarkMode } = useContext(ThemeContext);

  const validateInput = (inputId, inputValue) => {
    switch (inputId) {
      case "fullName":
        return inputValue.trim().length > 0 ? true : "Name is required";
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputValue) ? true : "Invalid email format";
      case "password":
        return inputValue.length >= 6 || inputValue.length === 0
          ? true
          : "Password must be at least 6 characters";
      default:
        return true;
    }
  };

  const inputChangedHandler = (inputId, inputValue) => {
    const validationResult = validateInput(inputId, inputValue);
    dispatchFormState({
      inputId,
      validationResult: validationResult || null,
      inputValue,
    });
  };

  const handleUpdate = async () => {
    const updatedData = {};

    if (formState.inputValues.fullName !== userData.fullName) {
      updatedData.fullName = formState.inputValues.fullName;
    }
    
    if (formState.inputValues.email !== userData.email) {
      updatedData.email = formState.inputValues.email;
    }

    if (formState.inputValues.password) {
      const validationResult = validateInput('password', formState.inputValues.password);
      if (validationResult === true) {
        updatedData.password = formState.inputValues.password;
      } else {
        Alert.alert('Please fix the errors in the form.');
        return;
      }
    }

    if (Object.keys(updatedData).length === 0) {
      Alert.alert('No changes detected.');
      return;
    }

    try {
      await dispatch(updateUser(userData.userId, updatedData));
      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#000" : "#E9E3E6" }]}>
      <Text style={[styles.headertit, { color: isDarkMode ? "white" : "#736F72" }]}>Edit User</Text>
      <TextInput
        placeholder="Full Name"
        value={formState.inputValues.fullName}
        onChangeText={(text) => inputChangedHandler('fullName', text)}
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      {formState.inputValidities.fullName && <Text style={styles.errorText}>{formState.inputValidities.fullName}</Text>}
      <TextInput
        placeholder="Email"
        value={formState.inputValues.email}
        onChangeText={(text) => inputChangedHandler('email', text)}
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      {formState.inputValidities.email && <Text style={styles.errorText}>{formState.inputValidities.email}</Text>}
      <TextInput
        placeholder="Password"
        placeholderTextColor={isDarkMode ? "#ffffff" : "#736F72"}
        value={formState.inputValues.password}
        onChangeText={(text) => inputChangedHandler('password', text)}
        secureTextEntry
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      {formState.inputValidities.password && <Text style={styles.errorText}>{formState.inputValidities.password}</Text>}
      
      <CustomButton
        title="Update"
        onPress={handleUpdate}
        style={{ marginVertical: 50, marginHorizontal: 15, backgroundColor: 'white' }}
        borderColor={isDarkMode ? "white" : "white"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    gap: 8
  },
  headertit: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginVertical: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default Edituser;
