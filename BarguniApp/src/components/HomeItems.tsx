import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Divider} from '@rneui/base';
import {changeItemStatus, Item} from '../api/item';
import {getCategory} from '../api/category';
interface HomeItem {
  item: Item;
  category: string;
  remove: Function;
  basketName: string;
}

function HomeItems(props: HomeItem) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const item = props.item;
  const deleteItem = useCallback(async () => {
    // Todo : 삭제 할 아이템
    try {
      console.log(item.itemId, 'itemid');
      await changeItemStatus(item.itemId, true);
      props.remove(item.itemId);
    } catch (error) {
      console.log(error, 'error');
    }
    // console.log(item);
  }, [item.itemId, props]);
  const shelfLife = new Date();
  const onClick = useCallback(() => {
    navigation.navigate('ItemDetail', {...item, basketName: props.basketName});
  }, [item, navigation]);
  return item.category === props.category ? (
    <View>
      <View style={Style.container}>
        <View style={Style.row}>
          <Image style={Style.picture} source={require('../assets/bell.png')} />
        </View>
        <Pressable style={Style.row2} onPress={onClick}>
          <Text style={Style.date}> {item.name}</Text>
          <Text style={Style.date2}>
            {item.regDate.toString().substring(0, 10)}
          </Text>
          <Text style={Style.date2}> {item.category}</Text>
        </Pressable>
        <View style={Style.row3}>
          <Text style={Style.dDay}>
            D -{' '}
            {item.dday === null
              ? Math.abs(
                  (new Date(item.shelfLife).getTime() - new Date().getTime()) /
                    (1000 * 3600 * 24),
                ).toFixed(0)
              : item.dday}
          </Text>
          <Text style={Style.lifetime}>
            유통기한:
            {item.shelfLife === null
              ? new Date(shelfLife.setDate(new Date().getDate() + item.dday))
                  .toJSON()
                  .substring(0, 10)
              : item.shelfLife}
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
    </View>
  ) : (
    <></>
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
    marginTop: 15,
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
