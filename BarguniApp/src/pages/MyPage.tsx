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

function MyPage() {
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState('');

  const init = useCallback(async () => {
    const userInfo = await getProfile();
    console.log(userInfo, '유저인포');
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const handleChangeName = useCallback(name => {
    console.log(name);
    setNewName(name);
  }, []);

  const modifyUserName = useCallback(async () => {
    try {
      const res = await changeName(newName);
      console.log(res, '결과');
      await Alert.alert('변경완료되었습니다.');
    } catch (err) {
      console.log(err, 'userName change ERROR');
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    // TODO: 회원탈퇴 후 스토어에서 토큰삭제
    await Alert.alert('정말,,, 탈퇴하시렵니까,,');
    try {
      await signOut();
      console.log('byebye...');
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
