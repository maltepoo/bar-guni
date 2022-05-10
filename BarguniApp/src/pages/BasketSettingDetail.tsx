import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {deleteBasket, getBasketMembers, updateBasketName} from '../api/basket';
import {deleteCategory, getCategory, updateCategory} from '../api/category';
import {navigate} from '../../RootNavigation';

function BasketSettingDetail({route}) {
  const basketInfo = route.params;
  const [newBasketName, setNewBasketName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [basketCategories, setBasketCategories] = useState([]);
  const [basketMembers, setBasketMembers] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = useCallback(async () => {
    initCategories();
    initMembers();
  });

  const initCategories = useCallback(async () => {
    try {
      const category = await getCategory(basketInfo.bkt_id);
      await setBasketCategories(category);
      console.log(category, '카테고리목록조회');
    } catch (e) {
      console.log(e, '카테고리 목록조회 에러');
    }
  });

  const initMembers = useCallback(async () => {
    try {
      const members = await getBasketMembers(basketInfo.bkt_id);
      await setBasketMembers(members, '바스켓멤버조회');
    } catch (e) {
      console.log(e, '바스켓 참여멤버조회 에러');
    }
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
    await Alert.alert('카테고리 삭제', `${name} 카테고리를 삭제하시겠습니까?`);
    try {
      const res = await deleteCategory(cateId);
      await Alert.alert('카테고리 삭제완료', res.message);
    } catch (err) {
      console.log(err, '카테고리 삭제 에러');
    }
  });

  const renderBasketCategories = useCallback(({item}) => {
    return (
      <TouchableOpacity>
        <Text>{item.name}</Text>
        <TextInput
          placeholder="새로운 카테고리 이름 입력"
          value={newCategoryName}
          onChangeText={handleNewCategoryName}
        />
        <TouchableOpacity
          onPress={() => {
            updateCategoryName(item.cateId);
          }}>
          <Text>@@@이름바꾸기@@@ OK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleDeleteCategory(item.name, item.cateId);
          }}>
          <Text>바구니카테고리삭제</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  });

  const moveToInvite = useCallback(() => {
    navigate('BasketInvite', basketInfo);
  });
  const bktname = JSON.stringify(basketInfo.bkt_name);
  return (
    <View style={style.container}>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: 'black',
            marginTop: '5%',
            marginBottom: '5%',
            marginRight: '5%',
          }}>
          {bktname.replace(/\"/gi, '')}
        </Text>
      </View>
      <View style={style.row}>
        <Text style={style.left}>바구니 참여자 목록 :</Text>
        <Text>{JSON.stringify(basketMembers)}</Text>
      </View>
      <Text style={style.left}>카테고리 :</Text>
      <Text>{JSON.stringify(basketCategories)}</Text>
      <FlatList data={basketCategories} renderItem={renderBasketCategories} />
      <TouchableOpacity onPress={moveToInvite}>
        <Text>바구니 초대하기(초대코드 페이지로 이동)</Text>
      </TouchableOpacity>
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
    </View>
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
  row: {
    flexDirection: 'row',
  },
  left: {
    width: '35%',
    fontWeight: 'bold',
    fontSize: 15,
    color: 'black',
  },
});
export default BasketSettingDetail;
