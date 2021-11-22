import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Modal,
  Image,
  TextInput,

} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BabyInfos from '../model/BabyInfos';

import { useTheme } from 'react-native-paper';

import * as realmDB from '../components/realmDB'

//20211120目前要把setAcounts與listData做結合，才可以在screen顯示出來加入倒realmDB的資料

//adb pull /data/data/com.foodfinder/files/. d:/temp
const BabyInfoScreen = ({navigation}) => {



  const [listData, setListData] = useState(
    BabyInfos.map((BabyInfoItem, index) => ({
      key: `${index}`,
      title: BabyInfoItem.title,
      details: BabyInfoItem.details,
      _id:''
    })),
  );

  // const getItemLayout = (data, index) =>({
    
  // })

  const [isVisible,setIsVisible] = useState(false)
  const [modifyTitle,setModifyTitle] = useState()
  const [modifyDetails,setModifyDetails] = useState()
  const [tempRowMap, setTempRowMap] =useState({})
  const [tempRowKey, setTempRowKey] =useState()
  const [tempData, setTempData] =useState({})

  const [isAddVisible,setIsAddVisible] = useState(false)

  const { colors } = useTheme();

  const swipeListView = useRef(null)

  //refresh setting---start
  const [acounts, setAcounts] = useState([]);
  // const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

      return fetchAcountsListCall();
  }, []);

  const fetchAcountsListCall = () => {
    realmDB.getRealm().then(realm => {
          const acountsList = realm.objects('Acount');
          setAcounts(acountsList);
          setLoading(false);
          acountsList.addListener(() => {
              setAcounts([...acountsList]);
          });
          return () => {
            const acountsList = realm.objects('Acount');
            acountsList.removeAllListeners();
            realm.close();
          };
      }).catch(error => {
          setLoading(false);
          console.log(error,'ERROR');
      });
  }

  // const fetchAcountsListCall = () => {
  //   realmDB.getRealm().then(realm => {
  //         const acountsList = realm.objects('Acount');
  //         setListData(acountsList);
  //         setLoading(false);
  //         acountsList.addListener(() => {
  //             setListData([...acountsList]);
  //         });
  //         return () => {
  //           const acountsList = realm.objects('Acount');
  //           acountsList.removeAllListeners();
  //           realm.close();
  //         };
  //     }).catch(error => {
  //         setLoading(false);
  //         console.log(error,'ERROR');
  //     });
  // }


  //   const [listData, setListData] = useState(
  //     acounts.map((BabyInfoItem, index) => ({
  //     key: `${index}`,
  //     title: BabyInfoItem.title,
  //     details: BabyInfoItem.details,
  //     _id:BabyInfoItem._id
  //   })),
      
  // );

  // const babyInfoscopy = BabyInfos.map((BabyInfoItem, index) => ({
  //   key: `${index}`,
  //   title: BabyInfoItem.title,
  //   details: BabyInfoItem.details,
  //   _id:''
  // })),

  // acounts.forEach(element => {
  //   acounts.push(element);
  // });

  // const [listData, setListData] = useState(
    
  // );
//   );
  // console.log("-------------------listData",listData)
  //   console.log("-------------------acounts",acounts)
  //   console.log("-------------------acounts",acounts[0])
  
//refresh setting---end

  // const scrollToEnd = ()=>{
  //   swipeListView.current.scrollToEnd({
  //     animated :true
  //   })
  // }

  // hide show modal
  const displayModal=(show)=>{
    setIsVisible(show)
  }
  // hide show modal
  const displayModal2=(show)=>{
    setIsAddVisible(show)
  }

  // function settingModal(obj){
  //   setModifyObj(obj)
  //   return "ok"
  // }

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const modifyRow = (rowMap, rowKey, data, ) => {
    closeRow(rowMap, rowKey);

    const newData = [...listData];
    // {console.log('edit-------------',rowMap)}
    {console.log('edit---data----',data)}
    {console.log('edit---rowKey----',rowKey)}
    //找出data的index
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    //找出此data物件
    const beforeData = listData[prevIndex];
    {console.log('edit---listData[prevIndex].----',beforeData)}
    //利用傳入的data來修改listData內容(----這裡還需要修改----)
    const afterData = {
      key: rowKey,
      title: 'test-----------title',
      details: 'test----------------details'
    }
    //刪除當前資料並將更新後的資料塞回
    newData.splice(prevIndex, 1, afterData);
    // {console.log('edit---rowMap[rowKey].----',rowMap[1])}
    setListData(newData);
  };

   const  modifyRow2 =  (rowMap, rowKey, data, ) => {
    //set  modifyRow3 input
    setTempRowMap(rowMap)
    setTempRowKey(rowKey)
    setTempData(data)

    //open edit modal
    displayModal(true)

    {console.log('---------------listData.length----',listData.length)}
    {console.log('---------------listData.length----',listData[9].key)}
    //找出data的index
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    //找出此data物件
    const beforeData = listData[prevIndex];
    
    //setting modal default inputtext
    setModifyTitle(beforeData.title)
    setModifyDetails(beforeData.details)


  };
  const  modifyRow3 =  (rowMap, rowKey, data, ) => {
    
    closeRow(rowMap, rowKey);
    //close edit modal
    displayModal(false)
    // {console.log('edit---beforeData.----',isVisible)}
    
    const newData = [...listData];

    //找出data的index
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    //找出此data物件
    const beforeData = listData[prevIndex];
    // {console.log('edit---beforeData.----',beforeData.title)}
    // setModifyTitle(beforeData.title)
    // setModifyDetails(beforeData.details)
    // settingModal(beforeData)
    // {console.log('edit---modifyObj.----',modifyObj)}
    {console.log('---------------.----')}
    //利用傳入的data來修改listData內容(----這裡還需要修改----)
    const afterData = {
      key: rowKey,
      title: modifyTitle,
      details: modifyDetails
    }
    //刪除當前資料並將更新後的資料塞回
    newData.splice(prevIndex, 1, afterData);
    // {console.log('edit---rowMap[rowKey].----',rowMap[1])}
    setListData(newData);
    setTempRowMap({})
    setTempRowKey()
    setTempData({})
    setModifyTitle()
    setModifyDetails()


  };

  const  addRow = async () => {

    // closeRow(rowMap, rowKey);

    //close edit modal
    displayModal2(false)
    
    const newData = [...listData];

    //找出data的index
    // const prevIndex = listData.findIndex(item => item.key === rowKey);
    //找出此data物件
    // const beforeData = listData[prevIndex];
    const callength = `${(newData.length)+1}`
    
    const realm = await realmDB.getRealm();
    const uuid =new realmDB.UUID()
    {console.log('---------------.----')}
    //利用傳入的data來修改listData內容(----這裡還需要修改----)
    const afterData = {
      key: callength,
      title: modifyTitle,
      details: modifyDetails,
      _id:uuid
    }
    //刪除當前資料並將更新後的資料塞回
    newData.push(afterData);
    // {console.log('edit---rowMap[rowKey].----',rowMap[1])}
    setListData(newData);

    setTempRowMap({})
    setTempRowKey()
    setTempData({})
    setModifyTitle()
    setModifyDetails()

console.log("UUID",uuid)
    const newAcount = {
      _id: uuid,
      id: callength,
      title: modifyTitle,
      descripts:modifyDetails,
      
  };
    realm.write(() => {
          realm.create('Acount', newAcount);
  });
    // realmDB.accountCreate(
    //   callength,
    //   modifyTitle,
    //   modifyDetails
    //   )
      
      
  };

  const deleteRow = async (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    //找出要刪除位置
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    const prev_ID =listData[prevIndex]._id
    console.log("deleteRow_ID", prev_ID)
    //刪掉找到的位置，然後刪一筆
    newData.splice(prevIndex, 1);
    setListData(newData);
    
    try {
      const realm = await realmDB.getRealm();
      const deleteBook = realm.objectForPrimaryKey('Acount', prev_ID);
      realm.write(() => {
          if(deleteBook) {
              realm.delete(deleteBook);
          }
      });
      // const results = realm.objects('Acount');
      // setBooks(results);
  } catch(error) { 
      if(error){
          console.log(error.message); 
      }
  }

  };


  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const onLeftActionStatusChange = rowKey => {
    console.log('onLeftActionStatusChange', rowKey);
  };

  const onRightActionStatusChange = rowKey => {
    console.log('onRightActionStatusChange', rowKey);
  };

  const onRightAction = rowKey => {
    console.log('onRightAction', rowKey);
  };

  const onLeftAction = rowKey => {
    console.log('onLeftAction', rowKey);
  };

  const VisibleItem = props => {
    const {
      data,
      rowHeightAnimatedValue,
      removeRow,
      leftActionState,
      rightActionState,
    } = props;

    if (rightActionState) {
      Animated.timing(rowHeightAnimatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        removeRow();
      });
    }

    return (
      <Animated.View
        style={[styles.rowFront, {height: rowHeightAnimatedValue}]}>
        <TouchableHighlight
          style={styles.rowFrontVisible}
          onPress={() => console.log('Element touched')}
          underlayColor={'#aaa'}>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {data.item.title}
            </Text>
            <Text style={styles.details} numberOfLines={1}>
              {data.item.details}
            </Text>
          </View>
        </TouchableHighlight>
      </Animated.View>
    );
  };

  const renderItem = (data, rowMap) => {
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <VisibleItem
        data={data}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        removeRow={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  const HiddenItemWithActions = props => {
    const {
      swipeAnimatedValue,
      leftActionActivated,
      rightActionActivated,
      rowActionAnimatedValue,
      rowHeightAnimatedValue,
      onClose,
      onModify,
      onModify2,
      onDelete,
    } = props;

    if (rightActionActivated) {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 500,
        useNativeDriver: false
      }).start();
    } else {
      Animated.spring(rowActionAnimatedValue, {
        toValue: 75,
        useNativeDriver: false
      }).start();
    }

    return (
      <Animated.View style={[styles.rowBack, {height: rowHeightAnimatedValue}]}>
        <Text>Left</Text>
        {!leftActionActivated && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={onClose}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
          </TouchableOpacity>
        )}
        {!leftActionActivated && (
          
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft2]}
            onPress={onModify2}>
              
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={25}
              style={styles.trash}
              color="#fff"
            />
            
          </TouchableOpacity>
        )}
        
        {!leftActionActivated && (
          <Animated.View
            style={[
              styles.backRightBtn,
              styles.backRightBtnRight,
              {
                flex: 1,
                width: rowActionAnimatedValue,
              },
            ]}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={onDelete}>
              <Animated.View
                style={[
                  styles.trash,
                  {
                    transform: [
                      {
                        scale: swipeAnimatedValue.interpolate({
                          inputRange: [-90, -45],
                          outputRange: [1, 0],
                          extrapolate: 'clamp',
                        }),
                      },
                    ],
                  },
                ]}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={25}
                  color="#fff"
                />
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    const rowActionAnimatedValue = new Animated.Value(75);
    const rowHeightAnimatedValue = new Animated.Value(60);

    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        rowActionAnimatedValue={rowActionAnimatedValue}
        rowHeightAnimatedValue={rowHeightAnimatedValue}
        onClose={() => closeRow(rowMap, data.item.key)}
        onModify={() => modifyRow(rowMap, data.item.key, data)}
        onModify2={() => modifyRow2(rowMap, data.item.key, data)}
        onDelete={() => deleteRow(rowMap, data.item.key)}
      />
    );
  };

  // useEffect(()=>{
  //   setTimeout(() => {
  //     swipeListView.current.scrollToEnd({animated: true})
  //   }, 1000);
  // },[])

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      {/* <StatusBar backgroundColor="#FF6347" barStyle="light-content"/> */}
      {/* {console.log("開頭的地方---------------")}
      {console.log("---------------",listData.length-1)} */}
      <SwipeListView
        // listViewRef = {ref =>this._swipeListViewRef=ref }
        //react-native-swipe-list-view要用listViewRef
        listViewRef = {swipeListView}
        data={listData}
        //初始畫面到最後一筆，但是新增後只會停在新增之前畫面的地方
        // initialScrollIndex={listData.length-1}

        //滾動到結尾
        onContentSizeChange = {()=>{setTimeout(() => {
          swipeListView.current.scrollToEnd({animating: true})
        }, 200);}}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-225}
        disableRightSwipe
        onRowDidOpen={onRowDidOpen}
        leftActivationValue={100}
        rightActivationValue={-275}
        leftActionValue={0}
        rightActionValue={-500}
        onLeftAction={onLeftAction}
        onRightAction={onRightAction}
        onLeftActionStatusChange={onLeftActionStatusChange}
        onRightActionStatusChange={onRightActionStatusChange}
        //refresh用
        // onRefresh={fetchAcountsListCall}
      />
  
        <Modal
            animationType = {"slide"}
            transparent={false}
            visible={isVisible}
            onRequestClose={() => {
              Alert.alert('Modal has now been closed.');
            }}>
                          {/* <Image 
              source={require('../assets/logo.png')}
              style = { styles.image }
              /> */}

                  <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    // setModifyTitle(beforeData.title)
                    // setModifyDetails(beforeData.details)
                    autoCapitalize="none"
                    value={modifyTitle}
                     onChangeText={(modifyTitle) => setModifyTitle(modifyTitle)}
                    // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                                  <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    value={modifyDetails}
                    onChangeText={(modifyDetails) => setModifyDetails(modifyDetails)}
                    // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                      <TouchableOpacity
              style={styles.button}
              onPress={()=>  modifyRow3(tempRowMap, tempRowKey, tempData)}
              >
              <Text style={styles.buttonText}>Show Modal</Text>
          </TouchableOpacity>      

      </Modal>
      <TouchableOpacity
              style={styles.button}
              onPress={()=>  setIsAddVisible(true)}
              >
              <Text style={styles.buttonText}>ADD BabyInfo</Text>
              
              
          </TouchableOpacity>
          <Modal
            animationType = {"slide"}
            transparent={false}
            visible={isAddVisible}
            onRequestClose={() => {
              Alert.alert('Modal has now been closed.');
            }}>
                          {/* <Image 
              source={require('../assets/logo.png')}
              style = { styles.image }
              /> */}

                  <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    // setModifyTitle(beforeData.title)
                    // setModifyDetails(beforeData.details)
                    autoCapitalize="none"
                    value={modifyTitle}
                     onChangeText={(modifyTitle) => setModifyTitle(modifyTitle)}
                    // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                                  <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    value={modifyDetails}
                    onChangeText={(modifyDetails) => setModifyDetails(modifyDetails)}
                    // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                      <TouchableOpacity
              style={styles.button}
              onPress={()=>  addRow()}
              >
              <Text style={styles.buttonText}>Show Modal</Text>
          </TouchableOpacity>      

      </Modal>
                
    </View>
  );
};

export default BabyInfoScreen;

const styles = StyleSheet.create({
  textInput: {
    flex: 0.2,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 30,
    color: '#05375a',
},
  image: {
    marginTop: 150,
    marginBottom: 10,
    width: '100%',
    height: 350,
  },
  text: {
    fontSize: 24,
    marginBottom: 30,
    padding: 40,
  },
  button: {
    display: 'flex',
    height: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2AC062',
    shadowColor: '#2AC062',
    shadowOpacity: 0.5,
    shadowOffset: { 
      height: 10, 
      width: 0 
    },
    shadowRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
  },
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 150,
  },
  backRightBtnLeft2: {
    backgroundColor: '#ffbb00',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});
