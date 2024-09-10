import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default CustomButton = (props) => {
  const isLoading = props.isLoading || false;
  return (
    <TouchableOpacity style={{...styles.btn,...props.style}} onPress={props.onPress}>
        {
          isLoading && isLoading == true? (
            <ActivityIndicator size="small" color='black' />
          ) : (
            <Text style={{fontSize: 15,color:'black',fontWeight:'bold'}}>
              {props.title}
            </Text>
          )
        }
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
   btn : {
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
   }
})