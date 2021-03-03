import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')


const LikesList = (props) => {
    // const id= props.route.params.postId
    console.log(props);
    const [postid , setpostId] = useState(null)
    useEffect(() => {
        setpostId(props.route.params.postId)
    },[])
    // const fetchLikeUsers = (userid,postid) => {
    //     firebase.firestore()
    //     .collection('posts')
    //     .doc(userid)
    //     .collection("userPosts")
    //     .doc(postid)
    //     .collection("likes")
    //     .get({})
    // }
    return (
        <View>
            <Text>like count</Text>
            <Text>{postid}</Text>
        </View>
    )
}

export default LikesList
