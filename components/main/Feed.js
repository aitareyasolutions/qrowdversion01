import React, { useState, useEffect,useRef } from 'react';
import {
     StyleSheet, View, Text, Image, FlatList, Button, Platform, TouchableOpacity,
     TouchableNativeFeedback,Share, ActivityIndicator,RefreshControl
    } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import firebase from 'firebase';
require('firebase/firestore');
import { connect } from 'react-redux';
import {Video} from 'expo-av';
import Colors from '../Constants';

function Feed(props) {
    let onEndReachedCallDuringMomentum = false
    const viewref = useRef();
    const video = React.useRef(null);
    const [posts, setPosts] = useState([]);
    const [ isMoreLoading , setIsMoreLoading ] = useState(false)
    const [ isLoading , setIsLoading ] = useState(false)
    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0 ) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);

        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        LikeCounts(userId,postId)
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const LikeCounts = (userId,postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(1)    
            })
            
    }

    const onDislikePress = (userId, postId) => {
        LikeCountsdec(userId, postId) 
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    const LikeCountsdec = (userId,postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .update({
                likesCount: firebase.firestore.FieldValue.increment(-1)    
            })
            
    }
  
    const onShare = async (item) => {
        console.log(item);
        try {
            
            const Shareresponse = await Share.share({
 
                message:`${item}` 
            });
        }catch(e) {
            alert(e)
        }

      };
      
      console.log(posts);

      const renderFooter = () => {
          if( !isMoreLoading) return true ;
          return(
              <ActivityIndicator 
              size="large"
              color={Colors.button}
              style={{marginVertical:'5%'}}
              />
          )
      }

     const getMore = () => {
                // alert("reachded")
             setIsMoreLoading(true)
             setTimeout(() => {
                setIsMoreLoading(false)
             },2000)
     } 

     const onRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false)
        }, 2000);
     }

    return (
        <>
        <View style={{backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:'5%',paddingTop:Platform.OS === 'android' ? '10%':'10%',paddingBottom:'4%'}}>
            <Text style={{fontSize:24,fontWeight:'bold'}}>Qrowd</Text>
            <View style={{flexDirection:'row' ,justifyContent:'space-around',}}>
                <TouchableOpacity
                style={{marginRight:"15%"}}
                onPress={() => props.navigation.navigate("Search")}>
                    <MaterialCommunityIcons name="magnify" size={28} color="black" />
                    
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.navigation.navigate("Messages")}>
                  <MaterialCommunityIcons name="chat-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        {
            props.feed.length === 0 
            ? 
             <View 
             style={{justifyContent:'center',marginHorizontal:20,
             marginVertical:'50%',paddingHorizontal:10,paddingVertical:'5%',
             backgroundColor:'white',borderRadius:10,elevation:24,}}>
                <Text style={{ fontSize:18,marginBottom:'5%'}}>You are not following anyone , Follow others to see their posts </Text>
                <TouchableOpacity
                style={{backgroundColor:Colors.welcomebg,padding:'3%',borderRadius:5,}}
                onPress={() => props.navigation.navigate("Search")}
                >
                    <Text style={{textAlign:'center',color:Colors.white}}>Search </Text>
                </TouchableOpacity>
            </View>  
            :  
            <View style={styles.container}>

            <View style={styles.containerGallery}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    ListFooterComponent={renderFooter}
                    refreshControl = {
                        <RefreshControl   
                        refreshing = {isMoreLoading}
                        onRefresh={onRefresh}
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {onEndReachedCallDuringMomentum}}
                    onEndReached={() =>
                        {
                            if( ! onEndReachedCallDuringMomentum){
                                getMore();
                                onEndReachedCallDuringMomentum = true
                            }
                        }
                         }
                    renderItem={({ item }) => (
                        <View style={styles.containerImage} ref={viewref}>
                            {/* {console.log(item.downloadURL)} */}
                            <View style={{flexDirection:'row',paddingLeft:10,alignItems:"center"}}>
                                
                                <Image source = {{uri : item.user.photoURL}} style={{width:60,height:60,borderRadius:30,borderColor:Colors.button,borderWidth:1}}/>
                                <View style={{marginLeft:'3%'}}>
                                    <Text style={styles.userName} numberOfLines={1}>{item.user.displayName}</Text>
                                    <Text style={styles.timeStamp}>{item.creation.seconds}</Text>
                                </View>
                            </View>
                            <Text style={styles.postTitle}  numberOfLines={1}>{item.caption}</Text>
                            {/* <Video
                                style={styles.image}
                                // source={{
                                //     uri: 
                                //   }}
                                source={{ uri: item.downloadURL }}
                                useNativeControls
        	                    resizeMode="contain"
                                isLooping
                               
                            
                            /> */}
                            <Image 
                            source={{ uri: item.downloadURL }}
                            style ={styles.image} />
                            <View style={styles.postFooter}>
                            <View style={{flexDirection:"row" , justifyContent:"space-around" , marginTop:4}}>
                                { item.currentUserLike ?
                                    (
                                        <TouchableNativeFeedback 
                                        onPress={() => onDislikePress(item.user.uid, item.id)}
                                        >
                                            <MaterialCommunityIcons name="heart" size={24} color="blue" />
                                        </TouchableNativeFeedback>
                                    )
                                    :
                                    (
                                        <TouchableNativeFeedback 
                                        onPress={() => onLikePress(item.user.uid, item.id)} 
                                        >
                                            <MaterialCommunityIcons name="heart-outline" size={24} color="black" />
                                        </TouchableNativeFeedback>
                                      
                                    )
                                }
                                <TouchableOpacity  onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                     <MaterialCommunityIcons name="comment-text-outline" size={24} color="black" />
                                </TouchableOpacity>
        
                                    <TouchableOpacity onPress={ () => onShare (item.downloadURL)}>
                                         <MaterialCommunityIcons name="share-outline" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <Text onPress={() => props.navigation.navigate('likeList',{postId: item.id})}>{item.likesCount}</Text>

                            </View>
                        </View>

                    )}

                />
            </View>
        </View>
        
        
        }
       
    </>
    )
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3,
        backgroundColor:Colors.white,
        marginHorizontal:5,
        marginBottom:'2%',
        marginTop:5,
        paddingVertical:'2%',
        borderRadius:10,
    },
    image: {
        flex: 1,
        aspectRatio: 1/1,
        borderRadius:5

    },
    postFooter:{
        paddingHorizontal:'5%',
        paddingTop:'2%',
    },
    postheader:{
        paddingHorizontal:'5%',
        // paddingVertical:'2%',
    },
    postTitle:{
        fontWeight:'normal',
        color:Colors.gray,
        letterSpacing:1,
        paddingLeft:10,
    },
    timeStamp:{
        color:Colors.gray,
        fontSize:13,
    },
    userName:{
        fontSize:16,
        fontWeight:'bold',
        letterSpacing:0.2
    },
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);
