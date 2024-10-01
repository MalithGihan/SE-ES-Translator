import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import CustomButton from './CustomButton'
import { useNavigation } from "@react-navigation/native";

export default Welcome = () => {
  const navigation = useNavigation();
  return (
    <View  style={styles.background}>
      <View style={styles.middle}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Learn new things.Stay focused.</Text>
        <Text style={styles.subtitle2}>A Sinhala Translator</Text>
        <View style={{marginTop:72}}>
           <CustomButton 
             title="Login with Email"
             onPress={()=> navigation.navigate("SignIn")}
             style={{ margin: 10, backgroundColor:'white' }}
           />
           <View style={styles.bottonContainer}>
            <Text style={{fontSize:12, color:'white'}}>
              Don't have an account ?
            </Text>
            <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
               <Text style={{fontSize:14,fontWeight:'800',color:'white'}}>
                  {" "}Sign Up
               </Text>
            </TouchableOpacity>
           </View>
        </View>
        </View>
        <View style={styles.centeredButton}>
        <CommonNavBtn
          title="Home"
          onPress={() => navigation.navigate("Home")}
          style={{ margin: 5, backgroundColor: "white" }}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  background : {
    flex:1,
    backgroundColor:'black',
   
  },
  middle:{
    flex:1,
    marginTop:10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  // logo:{
  //  width: width*.8,
  //  height: height*.8,
  // },
  title: {
    color:'white',
    fontSize: 45,
    fontWeight:'800',
    textTransform: 'uppercase',
    marginBottom: 10
  },
  subtitle: {
    color: 'white',
    fontSize: 10,
    fontWeight:'400',
    marginBottom:20
  },
  subtitle2: {
    color: 'white',
    fontSize: 15,
    fontWeight:'500',
  },
  bottonContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    marginVertical:12
  },
  centeredButton: {
    bottom: 10,
    left: 10,
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
})