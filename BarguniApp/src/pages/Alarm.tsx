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
import {AlarmI, changeAlarm, getAlarms} from '../api/basket';
import {Button, Dialog, Portal, Snackbar} from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";

function Alarm() {
  const [alarms, setAlarms] = useState([] as AlarmI[]);
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = useCallback(() => {setVisible(false)});

  const reloadAlarm = useCallback(async () => {
    const res = await getAlarms();
    setAlarms(res);
  }, [alarms]);

  const removeAlarm = useCallback(
    (id: number) => {
      const list = alarms.filter(item => item.id !== id);
      setAlarms(list);
      setVisible(true);
    },
    [alarms],
  );
  const renderItem = useCallback(
    ({item}: {item: AlarmI}) => {
      return <AlarmItem item={item} remove={removeAlarm} reload={reloadAlarm} />;
    },
    [removeAlarm],
  );
  // Todo: 해당 바구니로 이동
  const goBasket = useCallback(() => {}, []);

  useEffect(() => {
    const init = async () => {
      const res = await getAlarms();
      // const list = res.filter(item => item.status === 'UNCHECKED');
      setAlarms(res);
    };
    init();
  }, []);

  return (
    <View style={Style.alarmContainer}>
      <View style={{alignItems: 'center'}}>
        <Text style={Style.content}>
          읽지않은 알림 <Text style={Style.count}>{alarms.filter(item => item.status === 'UNCHECKED').length}</Text>개
        </Text>
      </View>
      <Pressable onPress={goBasket}>
        <FlatList data={alarms} renderItem={renderItem} />
      </Pressable>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: '확인',
          onPress: () => {
            onDismissSnackBar
          },
        }}>
        알람이 삭제되었습니다.
      </Snackbar>
    </View>
  );
}
const Style = StyleSheet.create({
  alarmContainer: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center'
    paddingTop: 10,
  },
  count: {
    color: '#0094FF',
  },
  content: {
    width: 170,
    borderRadius: 150,
    paddingVertical: 8,
    backgroundColor: '#F5F4F4',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '500',
    color: '#000',
  },
  line: {
    width: '100%',
    height: 0.7,
    backgroundColor: 'gray',
  },
});
export default Alarm;
