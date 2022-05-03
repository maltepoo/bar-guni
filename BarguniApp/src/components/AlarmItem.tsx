import React, {useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
interface Props {
  message: string;
}
function AlarmItem({message}: Props) {
  console.log(message);

  return (
    <View style={Style.container}>
      <Text
        key={message}
        ellipsizeMode="tail"
        numberOfLines={2}
        style={Style.multiline}>
        알람아이템 {message}
      </Text>
      <Text style={Style.time}> 18일 전</Text>
    </View>
  );
}
const Style = StyleSheet.create({
  multiline: {
    width: '80%',
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
