import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { logout } from '../utils/actions/authActions';
import { useSelector, useDispatch } from 'react-redux'; 
import CustomButton from '../Screens/Login/CustomButton'; 

export default Profile = ({ navigation }) => {
  const dispatch = useDispatch(); // Use useDispatch
  const userData = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.token);

  const handleLogout = async () => {
    try {
      await logout(dispatch, navigation); 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Home User Page</Text>

        {userData ? (
          <View>
            <Text style={styles.text}>User Role: {userData.role}</Text>
            <Text style={styles.text}>Email: {userData.email}</Text>
            <Text style={styles.text}>Full Name: {userData.fullName}</Text>
          </View>
        ) : (
          <Text style={styles.text}>No user data available</Text>
        )}
      </View>
      <CustomButton
        title="Sign Out"
        onPress={handleLogout} // Call handleLogout here
        style={{ marginVertical: 8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
  },
});
