import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import CustomButton from './CustomButton'
import { useNavigation } from "@react-navigation/native";

export default Welcome = () => {
  const navigation = useNavigation();
  return (
    <View  style={styles.background}>
      
        {/* <Image source={images} resizeMode='contain' style={styles.logo} /> */}
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Learn new things.Stay focused.</Text>
        <Text style={styles.subtitle}>Sinhala Translator</Text>
        <View style={{marginTop:72}}>
           <CustomButton 
             title="Login with Email"
             onPress={()=> navigation.navigate("SignIn")}
             style={styles.btn}
           />
           <View style={styles.bottonContainer}>
            <Text style={{fontSize:12, color:'black'}}>
              Don't have an account ?
            </Text>
            <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
               <Text style={{fontSize:14,fontWeight:'800',color:'black'}}>
                  {" "}Sign Up
               </Text>
            </TouchableOpacity>
           </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  background : {
    flex:1,
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // logo:{
  //  width: width*.8,
  //  height: height*.8,
  // },
  title: {
    color:'black',
    fontSize: 30,
    fontWeight:'500',
    textTransform: 'uppercase',
    marginBottom: 5
  },
  subtitle: {
    color: 'black',
    fontSize: 12,
    fontWeight:'400',
  },
  bottonContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    marginVertical:12
  }
})