import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {changeName, getProfile, signOut} from '../api/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function MyPage() {
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const init = useCallback(async () => {
    const userInfo = await getProfile();
    console.log(userInfo, '유저인포');
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const handleChangeName = useCallback((name: string) => {
    setNewName(name);
  }, []);

  const modifyUserName = useCallback(async () => {
    try {
      await changeName(newName);
      await Alert.alert('변경완료되었습니다.');
      navigation.navigate('ItemList');
    } catch (err) {
      console.log(err, 'userName change ERROR');
    }
  }, [navigation, newName]);

  const handleSignOut = useCallback(async () => {
    // TODO: 회원탈퇴 후 스토어에서 토큰삭제
    await Alert.alert('정말 탈퇴하시겠습니까?');
    try {
      await signOut();
      await EncryptedStorage.removeItem('accessToken');
    } catch (err) {
      Alert.alert('회원탈퇴 실패', err);
    }
  }, []);

  return (
    <ScrollView>
      <Text>회원정보</Text>
      <Text>{userInfo.email}</Text>
      <Text>{userInfo.name}</Text>
      <TextInput
        placeholder={'회원이름입력폼'}
        value={newName}
        onChangeText={handleChangeName}
      />
      <TouchableOpacity onPress={modifyUserName}>
        <Text>회원이름수정</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>회원탈퇴</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default MyPage;
