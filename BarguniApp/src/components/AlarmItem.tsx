import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AlarmI, changeAlarm} from '../api/basket';
import {Button} from '@rneui/base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
    <>
      <View style={Style.container}>
        <View style={Style.dotContainer}>
          <FontAwesomeIcon name="circle" size={8} style={Style.dot} />
        </View>
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
      <View style={Style.line} />
    </>
  );
}
const Style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  dotContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  dot: {
    color: '#C4C4C4',
  },
  multiline: {
    width: '80%',
    marginLeft: 5,
    fontSize: 15,
    color: 'black',
    paddingHorizontal: 10,
  },
  time: {
    fontSize: 12,
    color: 'black',
    textAlign: 'right',
  },
  line: {
    width: '100%',
    height: 0.7,
    backgroundColor: '#F5F4F4',
    marginTop: 15,
  },
});

export default AlarmItem;
