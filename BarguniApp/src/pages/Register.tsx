import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {LoginApiInstance} from '../api/instance';
import Config from 'react-native-config';
import {getItems, ItemReq, registerItem} from '../api/item';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket, getBasketInfo} from '../api/basket';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

function Register({navigation}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const changeName = useCallback(text => {
    setName(text);
  }, []);
  const [content, setContent] = useState('');
  const changeContent = useCallback(text => {
    setContent(text);
  }, []);
  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [day, setDay] = useState(0);
  const [alertBy, setAlertBy] = useState('SHELF_LIFE');
  const [regDate, setRegDate] = useState(new Date());
  const [regOpen, setRegOpen] = useState(false);
  const [shelfLife, setShelfLife] = useState(new Date());
  const route = useRoute<RouteProp<RootStackParamList>>();
  const onSubmit = useCallback(async () => {
    try {
      if (alertBy === 'D_DAY') {
        shelfLife.setDate(new Date().getDate() + day);
      }
      console.log(shelfLife, '유효기간');
      const item: ItemReq = {
        bktId: selectedBasket,
        cateId: selectedCategory,
        name: name,
        shelfLife: shelfLife.toJSON().substring(0, 10),
        alertBy: alertBy,
        content: content,
        picId: null,
        dday: day,
      };
      await registerItem(item);
      navigation.navigate('ItemList');
    } catch (error) {
      console.log(error);
    }
  }, [
    alertBy,
    content,
    day,
    name,
    regDate,
    selectedBasket,
    selectedCategory,
    shelfLife,
  ]);
  useEffect(() => {
    async function init(): Promise<void> {
      console.log(route.params, 'params');
      const basketRes = await getBaskets();
      setBasket(basketRes);
      console.log(basketRes, 'basketRes');
      const categoryRes = await getCategory(basketRes[0].bkt_id);
      console.log(categoryRes, 'categoryRes');
      setCategory(categoryRes);
      setName(route.params.name);
    }
    init();
  }, []);

  return (
    <View>
      <View style={Style.cont}>
        <Text style={{marginRight: '5%'}}>제품명 :</Text>
        <TextInput
          style={Style.textInput}
          value={name}
          onChangeText={changeName}
          placeholder="제품명 입력"
        />
      </View>

      <View style={Style.cont}>
        <View>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(true);
              setShelfLife(regDate);
              setAlertBy('SHELF_LIFE');
            }}
          />
        </View>
        <Text>유효기간 관리</Text>
        <View>
          <Checkbox
            status={checked ? 'unchecked' : 'checked'}
            onPress={() => {
              setChecked(false);
              setAlertBy('D_DAY');
            }}
          />
        </View>
        <Text>지금부터 관리</Text>
      </View>
      {checked ? (
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              setRegOpen(true);
            }}>
            <Text>설정된 유효기간 : {regDate.toJSON().substring(0, 10)}</Text>
          </Pressable>
          <DateTimePicker
            isVisible={regOpen}
            mode="date"
            onConfirm={date => {
              setRegDate(date);
              setRegOpen(false);
            }}
            onCancel={() => {
              setRegOpen(false);
            }}
          />
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <View style={Style.cont}>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => setDay(day - 5)}>
              <Text>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => setDay(day - 1)}>
              <Text>-1</Text>
            </TouchableOpacity>
            <Text>D + {day}</Text>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => setDay(day + 1)}>
              <Text>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => {
                setDay(day + 5);
              }}>
              <Text>+5</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
      <View style={Style.cont}>
        <Text>설명 :</Text>
        <TextInput
          style={Style.contentInput}
          value={content}
          onChangeText={changeContent}
          placeholder="설명 입력"
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={Style.button} onPress={onSubmit}>
          <Text>등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: '15%',
  },
  col: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  daybutton: {
    borderRadius: 10,
    backgroundColor: '#32A3F5',
    width: 30,
    marginLeft: 7,
    marginRight: 7,
    alignItems: 'center',
  },
  button: {
    borderRadius: 10,
    width: '30%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32A3F5',
    height: 25,
  },
  name: {
    textAlign: 'center',
    top: 20,
  },
  textInput: {
    padding: 5,
    marginTop: 5,
    height: 30,
    margin: 5,
    borderWidth: 1,
    width: '40%',
    textAlign: 'center',
    // borderRadius: 10,
  },
  contentInput: {
    padding: 5,
    marginTop: 5,
    height: 30,
    margin: 5,
    borderWidth: 1,
    width: '70%',
    textAlign: 'center',
  },
  picture: {
    width: 80,
    height: 80,
  },
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},

  cancel: {
    marginTop: 10,
    width: 15,
    height: 15,
  },
});
export default Register;
