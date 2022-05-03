import React, {useCallback, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

function RegisterItems() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [day, setDay] = useState(10);
  const [checked, setChecked] = React.useState(false);
  const deleteItem = useCallback(() => {
    // Todo : 삭제 할 아이템
  }, []);
  const [basket, setBasket] = useState([
    {name: '테스트 바구니1', value: 1},
    {name: '테스트 바구니2', value: 2},
    {name: '테스트 바구니3', value: 3},
  ]);
  const [category, setCategory] = useState([
    {name: '테스트 카테고리1', value: 1},
    {name: '테스트 카테고리2', value: 2},
    {name: '테스트 카테고리3', value: 3},
  ]);
  const [selectedBasket, setSelectedBasket] = useState(basket[0]);
  const [selectedCategory, setSelectedCategory] = useState(basket[0]);

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

  return (
    <View style={Style.cont}>
      <Image style={Style.picture} source={require('../assets/bell.png')} />
      <View style={Style.col}>
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
          <Pressable onPress={deleteItem}>
            <Image
              style={Style.cancel}
              source={require('../assets/close.png')}
            />
          </Pressable>
        </View>

        {checked ? (
          <View style={{alignItems: 'center'}}>
            {/*//date picker*/}
            <Pressable
              onPress={() => {
                setRegOpen(true);
              }}
              // style={Style.description}
            >
              <Text>{regDate.toJSON()}</Text>
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
        ) : (
          <View style={{alignItems: 'center'}}>
            <View style={Style.cont}>
              <TouchableOpacity style={Style.button} onPress={onClickMinusFive}>
                <Text>-5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Style.button} onPress={onClickMinusOne}>
                <Text>-1</Text>
              </TouchableOpacity>
              <Text>D + {day}</Text>
              <TouchableOpacity style={Style.button} onPress={onClickPlusOne}>
                <Text>+1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Style.button} onPress={onClickPlusFive}>
                <Text>+5</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Picker
          selectedValue={selectedBasket}
          onValueChange={itemValue => {
            setSelectedBasket(itemValue);
          }}>
          {basket.map(item => (
            <Picker.Item label={item.name} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={itemValue => {
            setSelectedCategory(itemValue);
          }}>
          {category.map(item => (
            <Picker.Item label={item.name} />
          ))}
        </Picker>
      </View>
      <View style={Style.line} />
    </View>
  );
}
const Style = StyleSheet.create({
  cont: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  col: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#32A3F5',
    width: 30,
    marginLeft: 7,
    marginRight: 7,
    alignItems: 'center',
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
export default RegisterItems;
