import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function BasketDetail(props) {
  const [toggleMenu, setToggleMenu] = useState(true);
  const [tempCategories, setCategories] = useState([
    // TODO: 바구니 api 조회 후 state에 할당
    {
      id: 1,
      name: '마데카솔',
    },
    {
      id: 2,
      name: '후시딘',
    },
    {
      id: 3,
      name: '노스카나',
    },
  ]);
  const [tempMembers, setMembers] = useState([
    // TODO: 바구니 멤버 api 조회 후 state에 할당
    {id: 1, name: '김정빈'},
    {id: 2, name: '박다원'},
    {id: 3, name: '곽명필'},
  ]);

  const handleBasketDelete = useCallback(id => {
    // TODO: 바구니 아이템 삭제 요청
    Alert.alert(`${id} 삭제합니다`);
  });

  const handleMemberDelete = useCallback(id => {
    // TODO: 바구니 멤버 삭제 요청
    Alert.alert(`${id}아이디를 가진 회원을 바구니 멤버에서 삭제`);
  });

  const handleAuthority = useCallback(id => {
    // TODO: 권한 설정
    Alert.alert(`${id}아이디를 가진 회원의 권한을 설정`);
  });

  const renderCategory = useCallback(
    ({item}) => {
      return (
        <View>
          <Text>{item.name}</Text>
          <TouchableOpacity>
            <Text
              onPress={() => {
                handleBasketDelete(item.id);
              }}>
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [tempCategories],
  );

  const renderMembers = useCallback(
    ({item}) => {
      return (
        <View>
          <Text>{item.name}</Text>
          <TouchableOpacity
            onPress={() => {
              handleMemberDelete(item.id);
            }}>
            <Text>삭제</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleAuthority(item.id);
            }}>
            <Text>권한설정</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [tempMembers],
  );

  const changeToggle = useCallback(status => {
    if (status === 'category') setToggleMenu(true);
    else setToggleMenu(false);
  });
  return (
    <>
      <View style={styles.basketHeader}>
        <Text>바구니이름</Text>
        <Text>멤버추가</Text>
        <Text>바구니나가기</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            changeToggle('category');
          }}>
          <Text>카테고리</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            changeToggle('member');
          }}>
          <Text>멤버</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <FlatList
          data={toggleMenu ? tempCategories : tempMembers}
          renderItem={toggleMenu ? renderCategory : renderMembers}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  basketHeader: {
    backgroundColor: '#cacaca',
  },
  menu: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
  },
  menuItem: {
    backgroundColor: 'orange',
  },
});

export default BasketDetail;
