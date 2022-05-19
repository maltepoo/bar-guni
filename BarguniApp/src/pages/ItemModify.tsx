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
import Config from 'react-native-config';

function ItemModify() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [expDate, setExpDate] = useState(new Date());
  const [expOpen, setExpOpen] = useState(false);
  const [regDate, setRegDate] = useState(new Date());
  const [regOpen, setRegOpen] = useState(false);
  const propsItem = route.params as ItemReq;
  const [items, setItem] = useState(propsItem);
  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
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
      console.log(items);
      const item: ItemReq = {
        bktId: selectedBasket,
        cateId: selectedCategory,
        name: items.name,
        alertBy: items.alertBy,
        shelfLife: expDate.toJSON().substring(0, 10),
        content: items.content,
        dday: items.dday,
      };
      console.log(item, 'ItemReq');
      await modifyItem(propsItem.itemId, item);
      navigation.navigate('ItemList');
    } catch (e) {
      console.log(e);
    }
  }, [
    selectedBasket,
    items.picId,
    items.name,
    items.alertBy,
    items.content,
    items.dday,
    selectedCategory,
    expDate,
    navigation,
  ]);

  const changeBasket = useCallback(async (itemValue: number) => {
    console.log(itemValue, ' 바구니 선택');
    setSelectedBasket(itemValue);
    const res = await getCategory(itemValue as number);
    setCategory(res);
    setSelectedCategory(res[0].cateId);
  }, []);
  const changeCategory = useCallback((itemValue: number) => {
    setSelectedCategory(itemValue);
    console.log(itemValue);
  }, []);
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
    <View style={Style.background}>
      <ScrollView>
        <View style={Style.imageBox}>
          <Image
            style={Style.image}
            source={{uri: Config.BASE_URL + items.pictureUrl}}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>제품명 </Text>
          <View style={Style.descriptionBox}>
            <TextInput
              activeUnderlineColor={'#0094FF'}
              value={items.name}
              onChangeText={changeName}
              style={Style.description}
            />
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>바구니 </Text>
          <View style={Style.descriptionBox}>
            <TextInput
              activeUnderlineColor={'#0094FF'}
              value={items.basketName}
              style={Style.description}
            />
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>등록일자 </Text>
          <Pressable
            onPress={() => {
              setRegOpen(true);
            }}>
            <Text style={Style.datedescription}>
              {regDate.toJSON().substring(0, 10)}
            </Text>
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
            }}>
            <Text style={Style.datedescription}>
              {expDate.toJSON().substring(0, 10)}
            </Text>
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
          <View style={Style.descriptionBox}>
            <TextInput
              activeUnderlineColor={'#0094FF'}
              numberOfLines={5}
              style={Style.description}
              multiline={true}
              value={items.content}
            />
          </View>
        </View>
        <Picker
          selectedValue={selectedBasket}
          onValueChange={itemValue => {
            changeBasket(itemValue).then();
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
            changeCategory(itemValue);
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
          <TouchableOpacity onPress={onModify} style={Style.button}>
            <Text style={Style.buttonTitle}>수정</Text>
          </TouchableOpacity>
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
  background: {
    backgroundColor: 'white',
    height: '100%',
    flex: 1,
  },
  button: {
    backgroundColor: '#0094FF',
    width: '40%',
    marginRight: '8%',
    borderRadius: 10,
  },
  buttonTitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginVertical: '5%',
  },
  imageBox: {
    alignItems: 'center',
    marginTop: 30,
    height: 150,
  },
  image: {
    width: '60%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    marginLeft: '10%',
    marginTop: '5%',
  },
  buttonContent: {
    flexDirection: 'row',
    marginLeft: '35%',
    marginTop: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Pretendard-Bold',
    color: 'black',
    width: '30%',
    marginBottom: '2%',
    marginTop: '3%',
  },
  description: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Pretendard-Light',
    marginLeft: '3%',
    marginTop: '3%',
    alignContent: 'center',
  },
  datedescription: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Pretendard-Light',
    marginRight: '10%',
    marginTop: '3%',
    marginBottom: '3%',
    alignSelf: 'center',
  },
  descriptionBox: {
    marginLeft: '2%',
    marginTop: '3%',
    width: '88%',
  },
});
export default ItemModify;
