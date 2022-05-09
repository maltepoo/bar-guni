import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import {Button, TextInput} from 'react-native-paper';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Item, ItemReq, modifyItem} from '../api/item';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket} from '../api/basket';
import {Picker} from '@react-native-picker/picker';

function ItemModify() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [expDate, setExpDate] = useState(new Date());
  const [expOpen, setExpOpen] = useState(false);
  const [regDate, setRegDate] = useState(new Date());
  const [regOpen, setRegOpen] = useState(false);
  const propsItem = route.params as Item;
  console.log(propsItem, 'props');
  const [items, setItem] = useState(propsItem);
  console.log(expDate, 'expDate');
  const changeName = useCallback(
    text => {
      setItem(() => ({
        ...items,
        name: text,
      }));
      // setItem({..item, name=text});
      console.log(items.name, 'anemitem');
    },
    [items],
  );
  const onModify = useCallback(async () => {
    try {
      const item: ItemReq = {
        bktId: selectedBasket,
        picId: null,
        cateId: selectedCategory,
        name: items.name,
        alertBy: items.alertBy,
        shelfLife: expDate.toJSON().substring(0, 10),
        content: items.content,
        dday: items.dday,
      };
      console.log(items.itemId, 'id');
      await console.log(item, 'item');
      await console.log(items, 'items');
      await modifyItem(items.itemId, item);
      navigation.navigate('ItemList');
    } catch (e) {
      console.log(e);
    }
  }, [navigation, items, expDate]);
  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);

  const [selectedBasket, setSelectedBasket] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  useEffect(() => {
    async function init(): Promise<void> {
      const basketRes = await getBaskets();
      setBasket(basketRes);
      console.log(basketRes, 'basketRes');
      const categoryRes = await getCategory(basketRes[0].bkt_id);
      console.log(categoryRes, 'categoryRes');
      setCategory(categoryRes);
    }
    init();
  }, []);
  return (
    <View>
      <ScrollView>
        <View style={Style.imageBox}>
          <Image style={Style.image} source={require('../assets/close.png')} />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>제품명 </Text>
          <TextInput
            activeUnderlineColor={'#0094FF'}
            value={items.name}
            onChangeText={changeName}
            style={Style.description}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>바구니 </Text>
          <TextInput
            activeUnderlineColor={'#0094FF'}
            value={items.basketName}
            style={Style.description}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>카테고리 </Text>
          <TextInput
            activeUnderlineColor={'#0094FF'}
            style={Style.description}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>등록일자 </Text>
          <Pressable
            onPress={() => {
              setRegOpen(true);
            }}
            style={Style.description}>
            <Text>{regDate.toJSON().substring(0, 10)}</Text>
          </Pressable>
          <DateTimePicker
            isVisible={regOpen}
            mode="date"
            onConfirm={date => {
              setRegDate(date);
              setRegOpen(false);
              console.log(date);
            }}
            onCancel={() => {
              setRegOpen(false);
            }}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>유통기한 </Text>
          <Pressable
            onPress={() => {
              setExpOpen(true);
            }}
            style={Style.description}>
            <Text>{expDate.toJSON().substring(0, 10)}</Text>
          </Pressable>
          <DateTimePicker
            isVisible={expOpen}
            mode="date"
            onConfirm={date => {
              setExpDate(date);
              setExpOpen(false);
              console.log(date.toJSON().substring(0, 10));
            }}
            onCancel={() => {
              setExpOpen(false);
            }}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>상세설명</Text>
          <TextInput
            activeUnderlineColor={'#0094FF'}
            numberOfLines={5}
            style={Style.description}
            multiline={true}
            value={items.content}
          />
        </View>
        <Picker
          selectedValue={selectedBasket}
          onValueChange={async itemValue => {
            setSelectedBasket(itemValue);
            const res = await getCategory(itemValue as number);
            setCategory(res);
            setSelectedCategory(res[0].cateId);
          }}>
          {basket.map(item => (
            <Picker.Item
              key={item.bkt_id}
              label={item.bkt_name}
              value={item.bkt_id}
            />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={itemValue => {
            setSelectedCategory(itemValue);
          }}>
          {category.map(item => (
            <Picker.Item
              label={item.name}
              key={item.cateId}
              value={item.cateId}
            />
          ))}
        </Picker>
        <View style={Style.buttonContent}>
          <Button style={Style.modify} mode="contained" onPress={onModify}>
            수정
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
const Style = StyleSheet.create({
  modify: {
    backgroundColor: 'green',
    borderRadius: 6,
    marginLeft: 40,
  },
  buttonTitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  imageBox: {
    alignItems: 'center',
    marginTop: 30,
    height: 150,
  },
  image: {
    width: '40%',
    height: '70%',
  },
  content: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    marginLeft: '27%',
    marginTop: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 15,
    marginTop: 15,
    fontWeight: 'bold',
    color: 'black',
    width: '25%',
  },
  description: {
    fontSize: 15,
    color: 'black',
    marginLeft: 20,
    width: '68%',
  },
});
export default ItemModify;
