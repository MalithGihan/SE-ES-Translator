import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = (props) => {
  const isLoading = props.isLoading || false;

  return (
    <TouchableOpacity
      style={{
        ...styles.btn,
        ...props.style,
        borderColor: props.borderColor || 'black', // Dynamic border color
      }}
      onPress={props.onPress}
    >
      {
        isLoading ? (
          <ActivityIndicator size="small" color='black' />
        ) : (
          <Text style={{ fontSize: 15, color: props.textColor || 'black', fontWeight: 'bold' }}>
            {props.title}
          </Text>
        )
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  }
});

export default CustomButton;
