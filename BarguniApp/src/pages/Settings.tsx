import React, {useCallback, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
function Settings({navigation}: SettingsScreenProps) {
  const [on, setOn] = useState(true);
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
  return (
    <View>
      <Text style={style.title}>알림</Text>
      <View style={style.line}></View>
      <Pressable onPress={goAlarm}>
        <Text style={style.content}>알림 설정</Text>
      </Pressable>
      <View style={style.imageBox}>
        <Text style={style.content}>알림 </Text>
        <Pressable
          style={style.button}
          onPress={() => {
            setOn(!on);
          }}>
          {on ? (
            <Image
              style={style.image}
              source={require('../assets/on-button.png')}></Image>
          ) : (
            <Image
              style={style.image}
              source={require('../assets/off-button.png')}></Image>
          )}
        </Pressable>
      </View>
      <Text style={style.title}>바구니</Text>
      <View style={style.line}></View>
      <Pressable onPress={goBasketSetting}>
        <Text style={style.content}>바구니 관리</Text>
      </Pressable>
      <Text style={style.title}>기타</Text>
      <View style={style.line}></View>
      <Pressable onPress={goTrashCan}>
        <Text style={style.content}>휴지통</Text>
      </Pressable>
      <Pressable onPress={goMyPage}>
        <Text style={style.content}>내 정보</Text>
      </Pressable>
      <Pressable>
        <Text style={style.content}>로그아웃</Text>
      </Pressable>
      <Pressable>
        <Text style={style.content}>회원탈퇴</Text>
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  button: {
    paddingLeft: 290,
  },
  title: {
    paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 35,
    color: 'black',
  },
  image: {
    paddingBottom: 50,
    width: 60,
    height: 20,
    resizeMode: 'stretch',
  },
  line: {
    width: '100%',
    height: 0.7,
    backgroundColor: 'gray',
  },
  content: {
    paddingLeft: 10,
    paddingTop: 20,
    fontSize: 20,
    color: 'black',
  },
  imageBox: {
    flexDirection: 'row',
  },
});

export default Settings;
