import React, {useCallback, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

function Register() {
  const [name, setName] = useState();
  const [day, setDay] = useState(10);
  const [checked, setChecked] = React.useState(false);
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
  // 등록버튼
  const onClick = useCallback(() => {}, []);
  return (
    <View>
      <View style={{alignItems: 'center'}}>
        <TextInput
          style={Style.textInput}
          onChangeText={setName}
          value={name}
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
            <Text>{regDate.toJSON()}</Text>
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
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={Style.button} onPress={onClick}>
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
