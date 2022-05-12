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
          status={checked || props.allSelect ? 'checked' : 'unchecked'}
          onPress={() => {
            props.select(item.itemId, checked);
            setChecked(!checked);
          }}
        />
      </View>
      <Image
        style={Style.image}
        source={require('../assets/loginlogo.png')}></Image>
      <View style={Style.content}>
        <View style={Style.container}>
          <Text style={Style.title}>{item.name}</Text>
        </View>
        <View style={Style.descriptionView}>
          <Text style={Style.description}>등록일 : {item.regDate}</Text>
        </View>
        <View style={Style.container}>
          <Text style={Style.description}>
            유효 기간:
            {item.shelfLife === null
              ? new Date(
                  shelfLife.setDate(
                    new Date(item.regDate).getDate() + item.dday,
                  ),
                )
                  .toJSON()
                  .substring(0, 10)
              : item.shelfLife}
            까지
          </Text>
        </View>
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  container: {flexDirection: 'row'},
  descriptionView: {marginTop: 10},
  checkbox: {marginTop: 50},
  image: {width: 100, height: 120, borderRadius: 20},
  content: {marginTop: 25, marginLeft: 20},
  title: {fontSize: 25, color: 'black', fontWeight: 'bold'},
  description: {fontSize: 15},
});

export default TrashItem;
