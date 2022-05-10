import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AlarmI, changeAlarm} from '../api/basket';
import {Button} from '@rneui/base';
interface Props {
  item: AlarmI;
  remove: Function;
}
function AlarmItem({item, remove}: Props) {
  console.log(item);
  const removeAlarm = useCallback(async () => {
    try {
      await changeAlarm(item.id);
      remove(item.id);
    } catch (e) {}
  }, [item.id]);
  return (
    <View style={Style.container}>
      <Text
        key={item.itemId}
        ellipsizeMode="tail"
        numberOfLines={2}
        style={Style.multiline}>
        {item.title}
      </Text>
      <Text style={Style.time}>
        {Math.ceil(
          (new Date().getTime() - new Date(item.createdAt).getTime()) /
            (1000 * 3600 * 24),
        )}
        일 전
      </Text>
      <Button
        title={'읽음'}
        titleStyle={{fontSize: 9}}
        buttonStyle={{marginTop: 5, marginLeft: 5}}
        onPress={removeAlarm}
      />
    </View>
  );
}
const Style = StyleSheet.create({
  multiline: {
    width: '65%',
    marginTop: 10,
    marginLeft: 5,
    fontSize: 15,
    color: 'black',
  },
  container: {
    flexDirection: 'row',
  },
  time: {
    marginTop: 10,
    fontSize: 15,
    color: 'black',
  },
});

export default AlarmItem;
