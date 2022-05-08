import React, {useCallback, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {updateBasketName} from '../api/basket';

function BasketSettingDetail({route}) {
  const basketInfo = route.params;
  const [newBasketName, setNewBasketName] = useState('');

  const handleNewBasketName = useCallback(name => {
    console.log(name, 'newBasketName');
    setNewBasketName(name);
  });

  const changeBasketName = useCallback(async () => {
    if (!newBasketName) {
      Alert.alert('바꿀 바구니 이름을 입력해주세요(공백불가)');
    } else {
      try {
        const res = await updateBasketName(basketInfo.bkt_id, newBasketName);
        console.log(res.message, '바구니 이름 변경 결과');
      } catch (err) {
        Alert.alert('error!', err.message);
      }
    }
  });

  return (
    <View>
      <Text>{JSON.stringify(basketInfo)}</Text>
      <TextInput
        placeholder="바꿀바구니이름입력하기"
        onChangeText={handleNewBasketName}
        value={newBasketName}
      />
      <TouchableOpacity onPress={changeBasketName}>
        <Text>바구니이름수정</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>바구니삭제</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>바구니카테고리수정</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>바구니카테고리삭제</Text>
      </TouchableOpacity>
    </View>
  );
}

export default BasketSettingDetail;
