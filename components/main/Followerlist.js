import React,{useEffect, useState} from 'react'
import { View, Text, FlatList } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')


const Followerlist = (props) => {
    const [userList, setUserList] = useState([]);
    const [user1 , setUser] = useState([])
  
    
    // useEffect(() => {
    //     const userlist = props.route.params.userids
    //     setUserList(userlist)

    // userlist.map((u) => {
    //     console.log(u);
    //         return(
    //             firebase.firestore()
    //             .collection("users")
    //             .doc(u)
    //             .get()
    //             .then((snapshot) => {
    //                 if (snapshot.exists) {
    //                     setUser(snapshot.data());
    //                     // console.log(user);
    //                 }
    //                 else {
    //                     console.log('does not exist')
    //                 }
    //         })
    //         )
    //     })
    // },[])
    // console.log(user);


    return (
        <>
        <Text style={{margin:30}}>
            {user1.email}
        </Text>
            
               
        </>
    )
}

export default Followerlist








