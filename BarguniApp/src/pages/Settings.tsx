import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  DatePickerAndroid,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TimePickerAndroid,
  View,
} from 'react-native';
import {Switch} from '@rneui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import {ParamListBase} from '@react-navigation/native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings',
  ParamListBase
>;
function Settings({navigation}: SettingsScreenProps) {
  const [on, setOn] = useState(true);
  const [alarmOn, setAlarmOn] = useState(false);
  const [alarmTime, setAlarmTime] = useState({hour: 0, min: 0});
  const dispatch = useAppDispatch();
  const goAlarm = useCallback(() => {
    navigation.navigate('AlarmSetting');
  }, [navigation]);
  const goMyPage = useCallback(() => {
    navigation.navigate('MyPage');
  }, [navigation]);
  const goTrashCan = useCallback(() => {
    navigation.navigate('TrashCan');
  }, [navigation]);
  const goBasketSetting = useCallback(() => {
    navigation.navigate('BasketSetting');
  }, [navigation]);
  const handleAlarmOn = useCallback(() => {
    setAlarmOn(true);
  }, []);
  const logout = useCallback(() => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      {
        text: '예',
        onPress: async () => {
          await EncryptedStorage.removeItem('accessToken');
          dispatch(userSlice.actions.setUser({}));
        },
      },
      {text: '아니오', onPress: () => {}},
    ]);
  }, []);

  const confirmAlarm = useCallback(async (time: any) => {
    const newTime = new Date(time);
    const hour = newTime.getHours();
    const min = newTime.getMinutes();
    setAlarmTime({hour: hour, min: min});
    console.log(hour, min);
    await EncryptedStorage.setItem('hour', hour.toString());
    await EncryptedStorage.setItem('min', min.toString());
    setAlarmOn(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const hour = await EncryptedStorage.getItem('hour');
      const min = await EncryptedStorage.getItem('min');
      console.log(hour, min);
      setAlarmTime({hour: Number(hour), min: Number(min)});
    };
    init();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 10,
      }}>
      <Text style={style.title}>알림</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={style.content}>알림시간 설정</Text>
        <Text style={style.content2} onPress={handleAlarmOn}>
          {alarmTime.hour}시 {alarmTime.min}분
        </Text>
        <DateTimePicker
          mode="time"
          isVisible={alarmOn}
          onConfirm={time => {
            confirmAlarm(time);
          }}
          onCancel={() => {
            setAlarmOn(false);
          }}
        />
      </View>
      <View style={style.imageBox}>
        <Text style={style.content}>
          알림 (유통기한 및 초대 알림을 받습니다)
        </Text>
        <Text style={style.content2}>
          <Switch value={on} onValueChange={value => setOn(value)} />
        </Text>
      </View>
      <View style={style.line}></View>
      <Text style={style.title}>바구니</Text>
      <Pressable onPress={goBasketSetting}>
        <Text style={style.content}>바구니 관리</Text>
      </Pressable>
      <View style={style.line}></View>
      <Text style={style.title}>기타</Text>
      <Pressable onPress={goTrashCan}>
        <Text style={style.content}>휴지통</Text>
      </Pressable>
      {/*<Pressable onPress={goMyPage}>*/}
      {/*  <Text style={style.content}>내 정보</Text>*/}
      {/*</Pressable>*/}
      <Pressable onPress={logout}>
        <Text style={style.content}>로그아웃</Text>
      </Pressable>
      {/*<Pressable>*/}
      {/*  <Text style={{...style.content, marginBottom: 40}}>회원탈퇴</Text>*/}
      {/*</Pressable>*/}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  button: {
    paddingLeft: 290,
  },
  title: {
    // paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    // backgroundColor: 'orange',
  },
  image: {
    paddingBottom: 50,
    width: 60,
    height: 20,
    resizeMode: 'stretch',
  },
  line: {
    height: 0.7,
    backgroundColor: '#F5F4F4',
    marginTop: 30,
  },
  content: {
    // paddingLeft: 10,
    paddingTop: 20,
    color: 'black',
    flex: 1,
  },
  content2: {
    paddingTop: 20,
    color: 'black',
  },
  imageBox: {
    // backgroundColor: 'yellow',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Settings;
