import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {fileApiInstance} from '../api/instance';
import Config from 'react-native-config';
import {getItems, ItemReq, registerItem} from '../api/item';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket, getBasketInfo} from '../api/basket';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import {Divider} from '@rneui/base';

function RegisterItems(props: any) {
  const [name, setName] = useState(props.item.name);
  const [content, setContent] = useState('');
  const [basket, setBasket] = useState(props.basketData as Basket[]);
  const [category, setCategory] = useState(props.categoryData as Category[]);
  const [selectedBasket, setSelectedBasket] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [day, setDay] = useState(0);
  const [alertBy, setAlertBy] = useState('SHELF_LIFE');
  const [regDate, setRegDate] = useState(new Date());
  const [regOpen, setRegOpen] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList>>();
  const index = props.index;

  const changeContent = useCallback(
    (text: string) => {
      setContent(text);
      const propsContent = [...props.contents];
      propsContent[index] = text;
      props.setContent(propsContent);
    },
    [index, props],
  );
  const changeName = useCallback(
    (text: string) => {
      setName(text);
      const propsName = [...props.names];
      propsName[index] = text;
      props.setContent(propsName);
    },
    [index, props],
  );

  const changeShelfLife = useCallback(() => {
    setChecked(true);
    const propsAlertBy = [...props.alertBy];
    propsAlertBy[index] = 'SHELF_LIFE';
    props.setAlertBy(propsAlertBy);
    setAlertBy('SHELF_LIFE');
  }, [index, props]);

  const changeDay = useCallback(() => {
    setChecked(false);
    const propsAlertBy = [...props.alertBy];
    propsAlertBy[index] = "D_DAY'";
    props.setAlertBy(propsAlertBy);
    setAlertBy('D_DAY');
  }, [index, props]);

  const settingDay = useCallback(
    (value: number) => {
      setDay(day + value);
      const propsDday = [...props.dday];
      propsDday[index] = day + value;
      props.setDday(propsDday);
    },
    [day, index, props],
  );

  useEffect(() => {
    async function init(): Promise<void> {
      const basketRes = await getBaskets();
      setBasket(basketRes);
      const categoryRes = await getCategory(basketRes[0].bkt_id);
      setCategory(categoryRes);
    }
    init();
  }, [route.params]);

  return (
    <View>
      <View style={Style.cont}>
        <Text style={{color: 'black'}}>제품명 :</Text>
        <TextInput
          style={Style.textInput}
          value={name}
          onChangeText={changeName}
          placeholder="제품명 입력"
        />
      </View>
      <View style={Style.cont}>
        <Text style={{color: 'black'}}>설명 :</Text>
        <TextInput
          style={Style.contentInput}
          value={content}
          onChangeText={changeContent}
          placeholder="설명 입력"
        />
      </View>
      <View style={Style.cont2}>
        <View style={{backgroundColor: 'orange'}}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={changeShelfLife}
          />
        </View>
        <Text style={{color: 'black'}}>유효기간 관리</Text>
        <View>
          <Checkbox
            status={checked ? 'unchecked' : 'checked'}
            onPress={changeDay}
          />
        </View>
        <Text style={{color: 'black'}}>지금부터 관리</Text>
      </View>
      {checked ? (
        <View style={Style.cont}>
          <Pressable
            onPress={() => {
              setRegOpen(true);
            }}>
            <Text style={{color: 'black', fontSize: 18, paddingVertical: 20}}>
              설정된 유효기간 : {regDate.toJSON().substring(0, 10)}
            </Text>
          </Pressable>
          <DateTimePicker
            isVisible={regOpen}
            mode="date"
            onConfirm={date => {
              setRegDate(date);
              setRegOpen(false);
              const propsShelfLifes = [...props.shelfLifes];
              propsShelfLifes[index] = date;
              props.setShelfLifes(propsShelfLifes);
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
              onPress={() => settingDay(-5)}>
              <Text>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => settingDay(-1)}>
              <Text>-1</Text>
            </TouchableOpacity>
            <Text>D + {day}</Text>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => settingDay(1)}>
              <Text>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.daybutton}
              onPress={() => {
                settingDay(5);
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
          const propsBasket = [...props.baskets];
          propsBasket[index] = itemValue;
          props.setBaskets(propsBasket);
          setCategory(res);
          setSelectedCategory(res[0].cateId);
          const propsCategory = [...props.categorys];
          propsCategory[index] = res[0].cateId;
          props.setCategory(propsCategory);
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
          console.log(itemValue);
          const propsCategory = [...props.categorys];
          propsCategory[index] = itemValue;
          props.setCategory(propsCategory);
        }}>
        {category.map(item => (
          <Picker.Item
            label={item.name}
            key={item.cateId}
            value={item.cateId}
          />
        ))}
      </Picker>
      <Divider width={2} />
    </View>
  );
}
const Style = StyleSheet.create({
  imageText: {
    color: 'white',
  },
  imageButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: '#0094FF',
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    marginLeft: '15%',
  },
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover',
  },
  cont: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 20,
  },
  cont2: {
    marginTop: 10,
    backgroundColor: 'blue',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
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
    // borderWidth: 1,
    width: '40%',
    textAlign: 'center',
    // borderRadius: 10,
  },
  contentInput: {
    padding: 5,
    marginTop: 5,
    height: 30,
    margin: 5,
    // borderWidth: 1,
    width: '40%',
    textAlign: 'center',
    // borderRadius: 10,
  },

  cancel: {
    marginTop: 10,
    width: 15,
    height: 15,
  },
});
export default RegisterItems;
