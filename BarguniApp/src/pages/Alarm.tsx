import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AlarmItem from '../components/AlarmItem';
import PushNotification from 'react-native-push-notification';
import {AlarmI, getAlarms} from '../api/basket';

function Alarm() {
  const [alarms, setAlarms] = useState([] as AlarmI[]);

  const removeAlarm = useCallback(
    (id: number) => {
      const list = alarms.filter(item => item.id !== id);
      setAlarms(list);
    },
    [alarms],
  );
  const renderItem = useCallback(
    ({item}: {item: AlarmI}) => {
      return <AlarmItem item={item} remove={removeAlarm} />;
    },
    [removeAlarm],
  );
  // Todo: 해당 바구니로 이동
  const goBasket = useCallback(() => {}, []);

  useEffect(() => {
    const init = async () => {
      const res = await getAlarms();
      const list = res.filter(item => item.status === 'UNCHECKED');
      setAlarms(list);
    };
    init();
  }, []);

  return (
    <View style={Style.background}>
      <Text style={Style.content}>
        읽지않은 알림 <Text style={Style.count}>{alarms.length}</Text>개
      </Text>
      <View style={Style.line} />
      <Pressable onPress={goBasket}>
        <FlatList data={alarms} renderItem={renderItem} />
      </Pressable>
    </View>
  );
}
const Style = StyleSheet.create({
  background: {backgroundColor: 'white', height: '100%'},
  count: {color: 'green'},
  content: {textAlign: 'center', fontSize: 30, marginTop: 10},
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default Alarm;
