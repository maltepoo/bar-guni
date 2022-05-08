import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getBaskets} from '../api/user';
import {navigate} from '../../RootNavigation';

function BasketSetting() {
  const [basketList, setBasketList] = useState([]);
  const getBasketList = useCallback(async () => {
    const res = await getBaskets();
    setBasketList(res);
  });

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

  return (
    <ScrollView>
      <Text>바구니 관리페이지</Text>
      <Text>바구니목록</Text>
      <FlatList data={basketList} renderItem={renderBasketList} />
    </ScrollView>
  );
}

export default BasketSetting;
