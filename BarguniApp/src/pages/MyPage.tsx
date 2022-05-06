import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {changeName, getProfile} from '../api/user';

function MyPage() {
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState('');

  useEffect(() => {
    init();
  }, []);
  const init = useCallback(async () => {
    const userInfo = await getProfile();
    console.log(userInfo, '유저인포');
    setUserInfo(userInfo);
  }, []);

  const handleChangeName = useCallback(name => {
    console.log(name);
    setNewName(name);
  });

  const modifyUserName = useCallback(async () => {
    try {
      const res = await changeName(newName);
      console.log(res, '결과');
      await Alert.alert('변경완료되었습니다.');
    } catch (err) {
      console.log(err, 'userName change ERROR');
    }
  });

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
    </ScrollView>
  );
}

export default MyPage;
