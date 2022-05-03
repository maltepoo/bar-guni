import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {useNavigation, NavigationProp} from '@react-navigation/native';

function HomeItems(props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const test = {id: 1};
  const deleteItem = useCallback(() => {
    // Todo : 삭제 할 아이템
  }, []);
  const onClick = useCallback(() => {
    navigation.navigate('ItemDetail', test);
  }, [navigation, test]);
  return (
      <Pressable onPress={onClick}>
        <View style={Style.container}>
          <View style={Style.row}>
            <Image
                style={Style.picture}
                source={require('../assets/bell.png')}></Image>
          </View>
          <View style={Style.row2}>
            <Text style={Style.date}> 등록일자</Text>
            <Text style={Style.date}> 2022.04.12</Text>
          </View>
          <View style={Style.row3}>
            <Text style={Style.color}>카테고리 이름</Text>
            <Text style={Style.color}>D-Day</Text>
          </View>
          <View style={Style.container}>
            <Pressable onPress={deleteItem}>
              <Image
                  style={Style.cancel}
                  source={require('../assets/close.png')}></Image>
            </Pressable>
          </View>
        </View>
        <View>
          <Text style={Style.title}>타이레놀</Text>
        </View>
        <View style={Style.line}></View>
      </Pressable>
  );
}
const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  row: {
    width: '20%',
    marginTop: 10,
    marginLeft: 5,
  },
  row2: {
    flexDirection: 'row',
    width: '40%',
  },
  row3: {
    width: '35%',
  },
  date: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 40,
    marginLeft: 5,
    color: 'black',
  },
  picture: {
    width: 80,
    height: 80,
  },
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
  title: {
    marginTop: 5,
    marginLeft: 20,
    color: 'black',
    fontSize: 15,
  },
  cancel: {
    marginTop: 10,
    width: 15,
    height: 15,
  },
  color: {
    marginTop: 25,
    marginLeft: 15,
    backgroundColor: '#0094FF',
    textAlign: 'center',
    color: 'white',
    borderRadius: 8,
    marginRight: 10,
  },
});
export default HomeItems;
