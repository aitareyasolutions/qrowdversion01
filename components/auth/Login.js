import React, { Component } from 'react'
import { View, Dimensions,Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from  '../Constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Feather} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import firebase from 'firebase'

const WindowHeight = Dimensions.get("window") ;


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {

        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <KeyboardAwareScrollView 
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={true}
            onPress={()=>{
                Keyboard.dismiss();
            }}> 
            <View style={{margin:15}}>
                <View>
                    <Text style={styles.title}> Welcome back to </Text>
                    <Text style={styles.title}> Qrowd</Text>
                </View>
                <View>
                    <Text style={styles.subtext}>Sign In </Text>
                </View>

                <View style={styles.inputwrap}>
                    <AntDesign name="mail" size={24} color="black" />
                    <TextInput
                         style={styles.input}
                        placeholder="email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                </View>
               <View style={styles.inputwrap}>
               <Feather name='eye' size={20} color="black"/>
                    <TextInput
                    style={styles.input}
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
               </View>
                  <View>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}>
                          <Text style={{textAlign:'right',fontSize:16,fontWeight:'bold',color:Colors.welcomebg}}> Forgot your Password ? </Text>
                      </TouchableOpacity>
                  </View>
               <TouchableOpacity
                style={styles.signInButton}
                onPress = {() => this.onSignUp()}
               >
                   <Text style={styles.signInText}> Sign In </Text>
               </TouchableOpacity>

            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")}>
                 <Text style={{textAlign:'center',fontWeight:'500'}} >Don`t have an account? <Text style={{ color:Colors.welcomebg,fontSize:16,fontWeight:'700',textDecorationLine:'underline'}}> Sign up  </Text>  </Text>
            </TouchableOpacity>
           
        </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    input:{
        // height:45,
        width:'100%',
        margin:10,
    },
    inputwrap:{
        display:'flex',
        flexDirection:'row',
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:Colors.gray,
        borderRadius:10,
        height:45,
        alignItems:'center',
        paddingHorizontal:10,
        margin:10,
    },
    signInButton:{
        marginVertical:'5%',
        backgroundColor:Colors.button,
        paddingVertical:'3%',
        borderRadius:10,
        elevation:10,
        shadowColor:Colors.button,
        shadowRadius:5,
        shadowOpacity:0.3,
        shadowOffset:{
            width:10,
            height:10,
        },
    },
    signInText:{
        fontSize:15,
        color:Colors.white,
        fontWeight:'bold',
        textAlign:'center'
    },
    subtext:{
        textAlign:'center',
        fontSize:24,
        fontWeight:'600',
        marginBottom:'2%'

    },
    title:{
        fontSize:WindowHeight.height < 600 ? 34  : 40,
        fontWeight:'bold',
        marginVertical:"2%",
        textAlign:'center'
        // marginLeft:10,
    },
})

export default Login

