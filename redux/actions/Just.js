import React,{useState,useEffect} from 'react'
import { View, Text, FlatList,Image, ActivityIndicator,RefreshControl } from 'react-native'
import * as firebase from 'firebase';
require('firebase/firestore');


// const lists =[
//   {
//     id:1,
//     name:'user1',
//     image:'https://images.all-free-download.com/images/graphicthumb/dark_flowers_608925.jpg',
//   },
//   {
//     id:2,
//     name:'user2',
//     image:'https://www.splitshire.com/wp-content/uploads/2016/09/SplitShire-01052.jpg',
//   },
//   {
//     id:3,
//     name:'user3',
//     image:'https://images.all-free-download.com/images/graphicthumb/dark_flowers_608925.jpg',
//   },
//   {
//     id:4,
//     name:'user4',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:5,
//     name:'user5',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:6,
//     name:'user6',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:7,
//     name:'user7',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:8,
//     name:'user8',
//     image:'https://www.splitshire.com/wp-content/uploads/2016/09/SplitShire-01052.jpg',
//   },
//   {
//     id:9,
//     name:'user9',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:10,
//     name:'user10',
//     image:'https://images.all-free-download.com/images/graphicthumb/dark_flowers_608925.jpg',
//   },
//   {
//     id:11,
//     name:'user11',
//     image:'https://i.pinimg.com/originals/bc/9b/a9/bc9ba91de4adc7393f16bbbb5261fd23.jpg',
//   },
//   {
//     id:12,
//     name:'user12',
//     image:'https://images.all-free-download.com/images/graphicthumb/dark_flowers_608925.jpg',
//   },
// ];

const RefreshScreen = () => {
  let onEndReachedCalledDurationMomentum = false
  const [isLoading, setisLoading] = useState(false)
  const [isMoreLoading, setisMoreLoading] = useState(false)
  const [lastDoc , setLastDoc] = useState(null)
  const [list , setList ] = useState([])

  useEffect( () => {
      getusers();
  },[])

  const getusers = async() => {
    setisLoading(true);
    const snapshot = await firebase.firestore().collection('userpost').orderBy('id').limit(4).get();

    if(!snapshot.empty){
      let newuser = [];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      for (let i = 0 ; i < snapshot.docs.length - 1 ; i++ ) {
          newuser.push(snapshot.docs[i].data())
      }
      setList(newuser)
    }else{
      setLastDoc(null)
    }
    onEndReachedCalledDurationMomentum = true;
  }

  const renderList = ({item}) => {
    return(
      <View>
        <Image source ={{uri:item.image}} style={{width:'100%',height:400}}/>
        <Text>{item.name}</Text>
        <Text>{item.id}</Text>
      </View>
    )
  }
  const renderFooter = () => {
    if(!isMoreLoading) return true;

    return (
      <ActivityIndicator size = "large" color="#222" style={{marginBottom:30}}/>
    )
  }

 const onRefresh = () => {
   getusers()
  }

 const getMore = async() => {
    if(lastDoc){
      setisMoreLoading(true);

      const snapshot = await firebase.firestore()
                                      .collection('userpost')
                                      .orderBy('id')
                                      .startAfter(lastDoc.data().id)
                                      .limit(4)
                                      .get();
                                        if(!snapshot.empty){
                                          let newuser = list;
                                    
                                          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
                                    
                                          for (let i = 0 ; i < snapshot.docs.length - 1 ; i++ ) {
                                              newuser.push(snapshot.docs[i].data())
                                          }
                                          setList(newuser)
                                          if(snapshot.docs.length < 3) setLastDoc(null);
                                        }else{
                                          setLastDoc(null)
                                        }
                                        setisLoading(false)
                                      }
                                      setisMoreLoading(false)
  }
  return (
    <View>
      <Text> hello</Text>
      <FlatList 
      data={list}
      keyExtractor={item => item.id.toString()}
      renderItem={renderList}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl 
        refreshing = {isLoading}
        onRefresh={onRefresh}
        />
      }
      onEndReachedThreshold={0.1}
      onMomentumScrollBegin={() => {onEndReachedCalledDurationMomentum = false}}
      onEndReached={() => {
        if(!onEndReachedCalledDurationMomentum){
          getMore();
          
        }
      }
      }
      />
    </View>
  )
}

export default RefreshScreen
