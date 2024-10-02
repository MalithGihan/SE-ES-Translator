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
      <Image 
          source={require('../../assets/images/Untitled-1.png')} 
          style={styles.logo}
          resizeMode="contain" 
        />
        <View style={styles.text}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Learn new things.Stay focused.</Text>
        <Text style={styles.subtitle2}>A Translator</Text>
        </View>

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
   width:'50%',
   height:'30%'
  },
  text:{
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center'
  },
  title: {
    marginTop:30,
    color:'white',
    fontSize: 55,
    fontWeight:'400',
    textTransform: 'uppercase',
    textAlign:'center'
  },
  subtitle: {
    color: 'white',
    fontSize: 10,
    fontWeight:'400',
    marginBottom:100,
    textAlign:'center'
  },
  subtitle2: {
    color: 'white',
    fontSize: 15,
    fontWeight:'500',
    marginBottom:60,
    textAlign:'center'
  },
  bottonContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center',
    marginVertical:12
  },
  logo:{
   width:'50%',
   height:'30%'
  },
  centeredButton: {
    flex:1,
    bottom: 10,
    left: 10,
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
})