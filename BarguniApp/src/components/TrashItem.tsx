import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {Item} from '../api/item';

type TrashItem = {
  item: Item;
  allSelect: boolean;
  select: Function;
};
function TrashItem(props: TrashItem) {
  // Todo: 상위에서 배열로 받아야할 것으로 보임
  const item = props.item;
  const shelfLife = new Date();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (props.allSelect) {
      setChecked(false);
    }
  }, [props.allSelect]);
  return (
    <View style={Style.container}>
      <View style={Style.checkbox}>
        <Checkbox
          color="#0094FF"
          uncheckedColor={'#757575'}
          status={checked || props.allSelect ? 'checked' : 'unchecked'}
          onPress={() => {
            props.select(item.itemId, checked);
            setChecked(!checked);
          }}
        />
      </View>
      <Image style={Style.image} source={require('../assets/loginlogo.png')} />
      <View style={Style.content}>
        <View style={Style.container}>
          <Text style={Style.title}>{item.name}</Text>
        </View>
        <View style={Style.descriptionView}>
          <Text style={Style.description}>{item.regDate} 등록</Text>
        </View>
        <View style={Style.container}>
          <Text style={Style.description}>
            {item.shelfLife === null
              ? new Date(
                  shelfLife.setDate(
                    new Date(item.regDate).getDate() + item.dday,
                  ),
                )
                  .toJSON()
                  .substring(0, 10)
              : item.shelfLife}{' '}
            까지
          </Text>
        </View>
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  container: {flexDirection: 'row'},
  descriptionView: {marginTop: 10, fontFamily: 'Pretendard-Light'},
  checkbox: {justifyContent: 'center'},
  image: {width: 100, height: 100, borderRadius: 20},
  content: {marginTop: 25, marginLeft: 20},
  title: {fontSize: 22, color: 'black', fontFamily: 'Pretendard-Bold'},
  description: {fontSize: 14, fontFamily: 'Pretendard-Light'},
});

export default TrashItem;
