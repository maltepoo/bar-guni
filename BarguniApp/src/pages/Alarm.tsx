import React, {useCallback, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import AlarmItem from '../components/AlarmItem';

function Alarm() {
  const [count, setCount] = useState(0);
  const alarms: any[] | null = [
    {
      message:
        '바구니에 상한 음식이 있습니다., 바구니에 상한 음식이 있습니다.바구니에 상한 음식이 있습니다.바구니에 상한 음식이 있습니다.바구니에 상한 음식이 있습니다.',
    },
    {message: '유통기한이 10일 남았습니다.'},
  ];
  const renderItem = useCallback(({item}: {item: Object}) => {
    return <AlarmItem message={item.message}></AlarmItem>;
  }, []);
  // Todo: 해당 바구니로 이동
  const goBasket = useCallback(() => {}, []);
  return (
    <View>
      <Text style={Style.content}>
        읽지않은 알림 <Text style={Style.count}>{count}</Text>개
      </Text>
      <View style={Style.line}></View>
      <Pressable onPress={goBasket}>
        <FlatList data={alarms} renderItem={renderItem}></FlatList>
      </Pressable>
    </View>
  );
}
const Style = StyleSheet.create({
  count: {color: 'green'},
  content: {textAlign: 'center', fontSize: 30, marginTop: 10},
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default Alarm;
