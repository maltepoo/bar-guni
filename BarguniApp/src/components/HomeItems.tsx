import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Divider} from '@rneui/base';
import {Item} from '../api/item';
interface HomeItem {
  item: Item;
}
function HomeItems(props: HomeItem) {
  console.log(props, 'props');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const deleteItem = useCallback(() => {
    // Todo : 삭제 할 아이템
  }, []);
  // const onClick = useCallback(() => {
  //   // navigation.navigate('ItemDetail', test);
  // }, [navigation]);
  const item = props.item;
  return (
    <Pressable>
      <View style={Style.container}>
        <View style={Style.row}>
          <Image style={Style.picture} source={require('../assets/bell.png')} />
        </View>
        <View style={Style.row2}>
          <Text style={Style.date}> {item.name}</Text>
          <Text style={Style.date2}>
            {item.regDate.toString().substring(0, 10)}
          </Text>
          <Text style={Style.date2}> {item.category}</Text>
        </View>
        <View style={Style.row3}>
          <Text style={Style.dDay}>D - {item.dday}</Text>
          <Text style={Style.lifetime}>
            유통기한: {item.usedDate.toString()}
          </Text>
        </View>
        <View style={Style.container}>
          <Pressable onPress={deleteItem}>
            <Image
              style={Style.cancel}
              source={require('../assets/close.png')}
            />
          </Pressable>
        </View>
      </View>
      <View style={{alignItems: 'center'}}>
        <Divider
          width={1}
          style={{marginTop: 10, width: '93%', alignItems: 'center'}}
          color="#ECECEC"
        />
      </View>
    </Pressable>
  );
}
const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  row: {
    width: '20%',
    marginTop: 10,
    marginLeft: 4,
  },
  row2: {
    marginLeft: 15,
    width: '35%',
  },
  row3: {
    backgroundColor: '#ECECEC',
    borderRadius: 30,
    width: '35%',
    marginTop: 20,
    height: 70,
  },
  date2: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 3,
    marginLeft: 8,
    color: 'black',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginLeft: 4,
    color: 'black',
  },
  picture: {
    width: 70,
    height: 80,
    borderRadius: 30,
  },
  title: {
    marginTop: 5,
    marginLeft: 12,
    color: 'black',
    fontSize: 15,
  },
  cancel: {
    marginTop: 5,
    width: 13,
    height: 13,
  },
  dDay: {
    marginTop: 15,
    marginLeft: 15,
    textAlign: 'center',
    marginRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  lifetime: {
    textAlign: 'center',
    fontSize: 10,
  },
});
export default HomeItems;
