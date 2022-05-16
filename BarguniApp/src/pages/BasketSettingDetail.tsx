import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {deleteBasket, getBasketMembers, updateBasketName} from '../api/basket';
import {deleteCategory, getCategory, updateCategory} from '../api/category';
import {navigate} from '../../RootNavigation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

function BasketSettingDetail({route}) {
  const basketInfo = route.params;
  const [newBasketName, setNewBasketName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [basketCategories, setBasketCategories] = useState([]);
  const [basketMembers, setBasketMembers] = useState([]);

  const initCategories = useCallback(async () => {
    try {
      const category = await getCategory(basketInfo.bkt_id);
      await setBasketCategories(category);
      console.log(category, '카테고리목록조회');
    } catch (e) {
      console.log(e, '카테고리 목록조회 에러');
    }
  }, [basketInfo.bkt_id]);

  const initMembers = useCallback(async () => {
    try {
      const members = await getBasketMembers(basketInfo.bkt_id);
      console.log(members);
      await setBasketMembers(members);
    } catch (e) {
      console.log(e, '바스켓 참여멤버조회 에러');
    }
  }, [basketInfo.bkt_id]);

  const init = useCallback(async () => {
    await initCategories();
    await initMembers();
  }, [initCategories, initMembers]);

  useEffect(() => {
    init();
  }, [init]);

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
        console.log(res, '바구니 이름 변경 결과');

        setChecked(true);

        // TODO: 바구니 목록 조회 다시하여 재렌더링하기
      } catch (err) {
        console.log(err);
      }
    }
  }, [basketInfo.bkt_id, newBasketName]);

  const handleDeleteBasket = useCallback(async () => {
    try {
      const res = await deleteBasket(basketInfo.bkt_id);
      Alert.alert('바구니삭제', res);
    } catch (err) {
      // console.log(err)
      // B003 에러 처리 사용자가 존재함 console.log(err.response.data.code);
    }
  }, [basketInfo.bkt_id]);

  const handleNewCategoryName = useCallback(name => {
    console.log(name, '새로운 카데고리 이름');
    setNewCategoryName(name);
  }, []);

  const updateCategoryName = useCallback(
    async cateId => {
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
    },
    [basketInfo.bkt_id, newCategoryName],
  );

  const handleDeleteCategory = useCallback(async (name, cateId) => {
    await Alert.alert('카테고리 삭제', `${name} 카테고리를 삭제하시겠습니까?`);
    try {
      const res = await deleteCategory(cateId);
      await Alert.alert('카테고리 삭제완료', res.message);
    } catch (err) {
      console.log(err, '카테고리 삭제 에러');
    }
  }, []);

  const moveToInvite = useCallback(() => {
    navigate('BasketInvite', basketInfo);
  }, [basketInfo]);
  const bktname = JSON.stringify(basketInfo.bkt_name);
  const [checked, setChecked] = React.useState(true);

  return (
    <ScrollView style={style.container}>
      <Text style={style.title}>바구니 이름</Text>
      <View>
        {checked ? (
          <View style={style.row}>
            <Text style={style.top}>{bktname.replace(/\"/gi, '')}</Text>
            <TouchableOpacity
              style={style.picture}
              onPress={() => setChecked(false)}>
              <FontAwesome5Icon name="pen" size={18} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={style.row}>
            <TextInput
              style={style.top}
              placeholder="바구니 이름"
              onChangeText={handleNewBasketName}
              value={newBasketName}
            />
            <TouchableOpacity style={style.te} onPress={changeBasketName}>
              <Text style={style.top}>완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={style.left}>바구니 참여자 목록 </Text>
      <Text
        style={{
          marginLeft: '6%',
          fontFamily: 'Pretendard-Light',
          color: 'black',
        }}>
        {basketMembers.map((item, index) => (
          <>
            <FontAwesomeIcon name="user-circle" />
            <Text>
              {' '}
              {item.name} {index !== basketMembers.length - 1 ? ',' : ''}
              {'  '}
            </Text>
          </>
        ))}
      </Text>
      <View style={style.row2}>
        <TouchableOpacity style={style.inviteButton} onPress={moveToInvite}>
          <Text style={style.buttonTitle}>바구니 초대하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.deleteButton}
          onPress={handleDeleteBasket}>
          <Text style={style.buttonTitle}>바구니 삭제하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  row2: {
    flexDirection: 'row',
    marginLeft: '10%',
    marginTop: '10%',
  },
  buttonTitle: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    marginVertical: '5%',
  },
  title: {
    // paddingLeft: 10,
    paddingTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 20,
    paddingTop: 10,
    // backgroundColor: 'orange',
  },
  deleteButton: {
    backgroundColor: 'red',
    width: '40%',
    marginRight: '8%',
    borderRadius: 10,
  },
  inviteButton: {
    backgroundColor: 'blue',
    width: '40%',
    marginRight: '8%',
    borderRadius: 10,
  },
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
  left: {
    width: '35%',
    fontFamily: 'Pretendard-Light',
    fontSize: 15,
    color: 'black',
    marginLeft: '7%',
    marginTop: '3%',
    marginBottom: '2%',
  },
  right: {
    width: '35%',
    fontFamily: 'Pretendard-Light',
    fontSize: 15,
    color: 'black',
    marginTop: '3%',
    marginBottom: '2%',
  },
  picture: {
    width: 20,
    height: 20,
    marginLeft: '5%',
    alignContent: 'flex-end',
  },
  top: {
    fontFamily: 'Pretendard-Light',
    fontSize: 20,
    color: 'black',
    marginleft: '5%',
  },
  te: {margin: '6%', alignItems: 'flex-end'},
});
export default BasketSettingDetail;
