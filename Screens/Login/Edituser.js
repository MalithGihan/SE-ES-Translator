import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState,useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../utils/actions/authActions'; 
import { ThemeContext } from "../../Components/SettingsContext";
import CustomButton from './CustomButton';

const Edituser = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  
  const [fullName, setFullName] = useState(userData.fullName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState('');
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleUpdate = async () => {
    try {
      const updatedData = { fullName, email, password }; 
      await dispatch(updateUser(userData.userId, updatedData));
      navigation.goBack(); 
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <View style={[styles.container,{ backgroundColor: isDarkMode ? "#000" : "#E9E3E6" }]}>
      <Text style={[
            styles.headertit,
            { color: isDarkMode ? "white" : "#736F72" },
          ]}>Edit User</Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={isDarkMode ? "#ffffff" : "#000"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { color: isDarkMode ? "white" : "#000" }]}
      />
      
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
    marginBottom:10,
  },
  input: {
    borderBottomWidth:2,
    borderBottomColor: '#fff',
    marginVertical: 10,
    padding: 10,
  },
});

export default Edituser;
