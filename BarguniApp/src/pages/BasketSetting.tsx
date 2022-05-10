import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
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
  }, [basketList]);

  const moveToSettingDetail = useCallback(item => {
    console.log('clicked!');
    navigate('BasketSettingDetail', item);
  });

  const renderBasketList = useCallback(({item}) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            moveToSettingDetail(item);
          }}>
          <Text
            style={{
              fontSize: 30,
              color: 'black',
              fontFamily: 'Jua Regular',
              marginLeft: '2%',
            }}>
            {item.bkt_name}
          </Text>
          {/*<Text>{item.bkt_id} / 바스켓아이디</Text>*/}
        </TouchableOpacity>
        <View style={style.line} />
      </>
    );
  });

  useEffect(() => {
    getBasketList();
  }, []);

  return (
    <ScrollView style={style.container}>
      <Text
        style={{
          fontSize: 20,
          color: 'grey',
          marginTop: '5%',
          marginBottom: '5%',
          marginLeft: '2%',
          fontFamily: 'Jua Regular',
        }}>
        바구니목록
      </Text>
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
  line: {
    height: 0.7,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 30,
  },
});
export default BasketSetting;
