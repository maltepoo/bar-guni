import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {changeName, getProfile, signOut, User} from '../api/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import {Avatar} from '@rneui/themed';

function MyPage() {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  } as User);
  const [newName, setNewName] = useState('');
  const [isOpenName, setIsOpenName] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const init = async () => {
      const res = await getProfile();
      setUserInfo(res);
    };
    init();
  }, []);

  const handleChangeName = useCallback((name: string) => {
    setNewName(name);
  }, []);

  const modifyUserName = useCallback(async () => {
    try {
      await changeName(newName);
      await Alert.alert('변경완료되었습니다.');
      setIsOpenName(false);
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

  const handleChangeForm = useCallback(() => {
    setIsOpenName(!isOpenName);
  }, [isOpenName]);

  return (
    <ScrollView style={Style.background}>
      <View style={Style.container}>
        <Avatar
          size={64}
          rounded
          title={`${userInfo.name.charAt(0)}`}
          containerStyle={{
            backgroundColor: '#3d4db7',
            marginVertical: 20,
            marginTop: '10%',
          }}
        />
        <Text style={Style.nameText}>{userInfo.name}</Text>
        <Text style={Style.emailText}>{userInfo.email}</Text>

        <TouchableOpacity style={{marginTop: 50}}>
          <Text onPress={handleChangeForm} style={{color: 'black'}}>
            닉네임 변경
          </Text>
        </TouchableOpacity>
        {isOpenName ? (
          <View style={{alignItems: 'center'}}>
            <View style={Style.textBox}>
              <TextInput
                placeholder={'수정하실 이름을 입력하세요'}
                value={newName}
                onChangeText={handleChangeName}
                style={Style.input}
              />
            </View>
            <TouchableOpacity onPress={modifyUserName} style={Style.modify}>
              <Text style={Style.modifyText}>수정</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity style={{marginTop: 30}}>
          <Text onPress={handleSignOut} style={{color: 'red'}}>
            탈퇴하기
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const Style = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Pretendard-Light',
    fontWeight: 'bold',
  },
  textBox: {
    backgroundColor: '#e9e9e9',
    width: Dimensions.get('window').width - 20,
    marginVertical: 10,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  modify: {
    backgroundColor: '#0094ff',
    marginBottom: 10,
    borderRadius: 100,
    width: 60,
  },
  modifyText: {
    fontSize: 16,
    color: '#fff',
    padding: 4,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'red',
    marginVertical: 10,
    borderRadius: 10,
  },
  nameText: {
    fontSize: 20,
    marginHorizontal: 20,
    color: 'black',
    fontFamily: 'Pretendard-Bold',
  },
  emailText: {
    marginTop: '1%',
    fontSize: 16,
    marginHorizontal: 20,
    color: 'black',
    fontFamily: 'Pretendard-Regular',
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    color: 'white',
    fontFamily: 'Pretendard-Light',
    fontWeight: 'bold',
  },
});

export default MyPage;
