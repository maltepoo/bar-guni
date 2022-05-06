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
import {getItems, registerItem} from '../api/item';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket, getBasketInfo} from '../api/basket';
function Register() {
  const [name, setName] = useState('');
  const changeName = useCallback(text => {
    setName(text);
  }, []);

  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);

  const [checked, setChecked] = React.useState(false);
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [day, setDay] = useState(10);
  const onClickMinusOne = useCallback(() => {
    setDay(day - 1);
  }, [day]);
  const onClickMinusFive = useCallback(() => {
    setDay(day - 5);
  }, [day]);
  const onClickPlusOne = useCallback(() => {
    setDay(day + 1);
  }, [day]);
  const onClickPlusFive = useCallback(() => {
    setDay(day + 5);
  }, [day]);
  // datepicker
  const [regDate, setRegDate] = useState(new Date());
  const [regOpen, setRegOpen] = useState(false);
  // 등록버튼
  const [bktId, setBktId] = useState(0);
  const [picId, setPicId] = useState(0);
  const [cateId, setCateId] = useState(0);
  const [alertBy, setAlertBy] = useState('alert');
  const [shelfLife, setShelfLife] = useState('shelf');
  const [content, setContent] = useState('content');
  const [dday, setDday] = useState(0);
  const axios = LoginApiInstance();

  const onSubmit = useCallback(async () => {
    try {
      const item = {
        bktId: selectedBasket,
        cateId: selectedCategory,
        name: name,
        shelfLife: regDate.toJSON().substring(0, 10),
        alertBy: 'SHELF_LIFE',
        content: '테스트용',
        picId: null,
        dday: null,
        // ddday로 했을 시에는 shelflife 필요 없음, 사진도 없으면 필요없음
      };
      const res2 = await getItems(-1);
      console.log(res2, ' 아이템 조회!');
      console.log(item, ' item');
      const res = await registerItem(item);
      console.log(res);
      const confirm = await getItems(selectedBasket);
      console.log(confirm, ' confirm');
    } catch (error) {
      console.log(error);
    }
  }, [name, regDate, selectedBasket, selectedCategory]);

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
              setChecked(!checked);
            }}
          />
        </View>
        <Text>지금부터 관리</Text>
        <View>
          <Checkbox
            status={checked ? 'unchecked' : 'checked'}
            onPress={() => {
              setChecked(!checked);
            }}
          />
        </View>
        <Text>유효기간 관리</Text>
      </View>
      {!checked ? (
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
              onPress={onClickMinusFive}>
              <Text>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Style.daybutton} onPress={onClickMinusOne}>
              <Text>-1</Text>
            </TouchableOpacity>
            <Text>D + {day}</Text>
            <TouchableOpacity style={Style.daybutton} onPress={onClickPlusOne}>
              <Text>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Style.daybutton} onPress={onClickPlusFive}>
              <Text>+5</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Picker
        selectedValue={selectedBasket}
        onValueChange={async itemValue => {
          console.log(itemValue, '바스켓 선택');
          setSelectedBasket(itemValue);
          const res = await getCategory(itemValue as number);
          setCategory(res);
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
