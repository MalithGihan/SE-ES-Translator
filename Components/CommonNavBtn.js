import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default CommonNavBtn = (props) => {
  return (
    <TouchableOpacity style={{...styles.btn,...props.style}} onPress={props.onPress}>
            <Text style={{fontSize: 15,color:'black',fontWeight:'bold'}}>
              {props.title}
            </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
   btn : {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    marginTop: 20,
   }
})