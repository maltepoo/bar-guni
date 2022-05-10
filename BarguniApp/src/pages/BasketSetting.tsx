import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text, TextInput, TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {getBaskets} from '../api/user';
import {navigate} from '../../RootNavigation';
import {joinBasket} from "../api/basket";

function BasketSetting() {
  const [basketList, setBasketList] = useState([]);
  const [inviteCode, setInviteCode] = useState("");

  const getBasketList = useCallback(async () => {
    const res = await getBaskets();
    setBasketList(res);
  }, [basketList]);

  const moveToSettingDetail = useCallback(item => {
    console.log('clicked!');
    navigate('BasketSettingDetail', item);
  });

  const renderBasketList = useCallback(({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          moveToSettingDetail(item);
        }}>
        <Text>{item.bkt_name} / 바스켓이름</Text>
        <Text>{item.bkt_id} / 바스켓아이디</Text>
      </TouchableOpacity>
    );
  });

  useEffect(() => {
    getBasketList();
  }, []);

  const handleInputChange = useCallback((code) => {
    setInviteCode(code);
  }, []);

  const handleJoinBasket = useCallback(async() => {
    try {
      console.log(inviteCode, "초대코드입력잘됐누;;")
      const res = await joinBasket(inviteCode);
      Alert.alert("바구니가입성공", JSON.stringify(res))
      // console.log(res, "바구니가입 잘댐")
    } catch (e) {
      console.log(e, "바구니가입 잘 안댐")
      Alert.alert("API통신 중 오류", JSON.stringify(e));
    }
  });

  return (
    <ScrollView>
      <Text>바구니 관리페이지</Text>
      <View>
        <TextInput value={inviteCode} onChangeText={handleInputChange} placeholder="초대코드를 입력해주세요" />
        <TouchableHighlight onPress={handleJoinBasket}>
          <Text>바구니 들어가기</Text>
        </TouchableHighlight>
      </View>
      <Text>바구니목록</Text>
      <FlatList data={basketList} renderItem={renderBasketList} />
    </ScrollView>
  );
}

export default BasketSetting;
