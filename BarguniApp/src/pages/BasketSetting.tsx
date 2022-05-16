import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {getBaskets} from '../api/user';
import {navigate} from '../../RootNavigation';
import {joinBasket} from '../api/basket';

function BasketSetting() {
  const [basketList, setBasketList] = useState([]);
  const [inviteCode, setInviteCode] = useState('');

  const getBasketList = useCallback(async () => {
    const res = await getBaskets();
    setBasketList(res);
  }, []);

  const moveToSettingDetail = useCallback(item => {
    console.log('clicked!');
    navigate('BasketSettingDetail', item);
  }, []);

  const renderBasketList = useCallback(
    ({item}) => {
      return (
        <>
          <TouchableOpacity
            onPress={() => {
              moveToSettingDetail(item);
            }}>
            <Text
              style={{
                fontSize: 15,
                color: 'black',
                fontFamily: 'Pretendard-Light',
                marginLeft: '10%',
                marginBottom: '4%',
              }}>
              {item.bkt_name}
            </Text>
            {/*<Text>{item.bkt_id} / 바스켓아이디</Text>*/}
          </TouchableOpacity>
          <View style={style.listline} />
        </>
      );
    },
    [moveToSettingDetail],
  );

  useEffect(() => {
    getBasketList();
  }, [getBasketList]);

  const handleInputChange = useCallback(code => {
    console.log(code, '입력코드');
    setInviteCode(code);
  }, []);

  const handleJoinBasket = useCallback(async () => {
    try {
      console.log(inviteCode, '초대코드입력잘됐누;;');
      const res = await joinBasket(inviteCode);
      Alert.alert('바구니가입성공', JSON.stringify(res));
      // console.log(res, "바구니가입 잘댐")
    } catch (e) {
      console.log(e, '바구니가입 잘 안댐');
      Alert.alert('API통신 중 오류', JSON.stringify(e));
    }
  }, [inviteCode]);

  return (
    <ScrollView style={style.container}>
      <Text style={style.title}>바구니 참여</Text>
      <View style={{alignItems: 'center'}}>
        <TextInput
          value={inviteCode}
          onChangeText={handleInputChange}
          style={{textAlign: 'center'}}
          placeholder="초대코드를 입력해서 바구니에 참여해보세요"
        />
        <TouchableOpacity
          onPress={handleJoinBasket}
          style={{
            alignItems: 'center',
            backgroundColor: '#F5F4F4',
            width: 140,
            borderRadius: 140,
          }}>
          <Text style={{color: '#0094FF', paddingVertical: 6}}>
            바구니 입장하기
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.line} />

      <Text style={style.title}>바구니 목록</Text>
      <FlatList data={basketList} renderItem={renderBasketList} />
    </ScrollView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

    // alignItems: 'center',
  },
  title: {
    marginTop: '4%',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 20,
    marginBottom: '4%',
  },
  line: {
    height: 0.7,
    backgroundColor: '#F5F4F4',
    marginTop: '5%',
  },
  listline: {
    height: 1.7,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#F5F4F4',
    marginBottom: '4%',
  },
});
export default BasketSetting;
