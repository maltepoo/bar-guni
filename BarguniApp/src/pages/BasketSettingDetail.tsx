import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {deleteBasket, updateBasketName} from '../api/basket';
import {deleteCategory, getCategory, updateCategory} from '../api/category';

function BasketSettingDetail({route}) {
  const basketInfo = route.params;
  const [newBasketName, setNewBasketName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [basketCategories, setBasketCategories] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = useCallback(async () => {
    const category = await getCategory(basketInfo.bkt_id);
    await setBasketCategories(category);
    console.log(category, '카테고리목록조회');
  });

  const handleNewBasketName = useCallback(name => {
    console.log(name, 'newBasketName');
    setNewBasketName(name);
  }, []);

  const changeBasketName = useCallback(async () => {
    if (!newBasketName) {
      Alert.alert('바꿀 바구니 이름을 입력해주세요(공백불가)');
    } else {
      try {
        const res = await updateBasketName(basketInfo.bkt_id, newBasketName);
        console.log(res.message, '바구니 이름 변경 결과');

        // TODO: 바구니 목록 조회 다시하여 재렌더링하기
      } catch (err) {
        Alert.alert('error!', err.message);
      }
    }
  });

  const handleDeleteBasket = useCallback(async () => {
    try {
      const res = await deleteBasket(basketInfo.bkt_id);
      Alert.alert('바구니삭제', res);
    } catch (err) {
      Alert.alert('error!', JSON.stringify(err));
    }
  });

  const handleNewCategoryName = useCallback(name => {
    console.log(name, '새로운 카데고리 이름');
    setNewCategoryName(name);
  });

  const updateCategoryName = useCallback(async cateId => {
    console.log('cateName Chainging');
    if (!newCategoryName) {
      Alert.alert('Error', '카테고리 이름은 공백이 될 수 없음');
    } else {
      try {
        const res = await updateCategory(
          basketInfo.bkt_id,
          cateId,
          newCategoryName,
        );
        await console.log(res, 'update category');
      } catch (err) {
        console.log(err);
      }
    }

  });

  const handleDeleteCategory = useCallback(async (name, cateId) => {
    await Alert.alert("카테고리 삭제", `${name} 카테고리를 삭제하시겠습니까?`);
    try {
      const res = await deleteCategory(cateId);
      await Alert.alert("카테고리 삭제완료", res.message);
    } catch (err) {
      console.log(err, "카테고리 삭제 에러")
    }
  });

  const renderBasketCategories = useCallback(({item}) => {
    return (
      <TouchableOpacity>
        <Text >{item.name}</Text>
        <TextInput
          placeholder="새로운 카테고리 이름 입력"
          value={newCategoryName}
          onChangeText={handleNewCategoryName}
        />
        <TouchableOpacity onPress={() => {
          updateCategoryName(item.cateId);
        }}>
          <Text
            >
            @@@이름바꾸기@@@ OK
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          handleDeleteCategory(item.name, item.cateId)
        }}>
          <Text>바구니카테고리삭제</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
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
        <Text>바구니이름수정 OK</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeleteBasket}>
        <Text>바구니삭제 OK</Text>
      </TouchableOpacity>
      <Text>카테고리 : {JSON.stringify(basketCategories)}</Text>
      <FlatList data={basketCategories} renderItem={renderBasketCategories} />
    </View>
  );
}

export default BasketSettingDetail;
