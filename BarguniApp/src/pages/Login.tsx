import React, {useCallback, useEffect} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// @ts-ignore
import logo from '../assets/loginlogo.png';
import {RootStackParamList} from '../../AppInner';
import KakaoSDK from '@actbase/react-kakaosdk';
import Config from 'react-native-config';
import {AccessTokenType} from '@actbase/react-kakaosdk/lib/types';
import {SocialType, login} from '../api/user';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

function Login({navigation}: LoginScreenProps) {
  const dispatch = useAppDispatch();
  const kakaoLogin = useCallback(async () => {
    // Alert.alert('회원가입', '이메일 설정을 해주세요!1');
    try {
      const res = (await KakaoSDK.login()) as AccessTokenType;
      console.log(res.access_token);
      if (!res.scopes.includes('account_email')) {
        await KakaoSDK.logout();
        Alert.alert('회원 가입 실패', '이메일 설정을 해주세요!2');
        navigation.navigate('Login');
      }
      const data = await login(SocialType.KAKAO, res.access_token);
      const userProfile = await KakaoSDK.getProfile();
      const user = {
        name: userProfile.properties.nickname,
        email: userProfile.kakao_account.email,
        accessToken: data.accessToken,
      };
      console.log(user);
      dispatch(userSlice.actions.setUser(user));
      await EncryptedStorage.setItem('refreshToken', data.refreshToken);
      await EncryptedStorage.setItem('accessToken', data.accessToken);
    } catch (e) {
      console.log(e, '카카오 로그인 중 에러');
    }
    // navigation.navigate('SignUp');
  }, [navigation]);
  useEffect(() => {
    async function init(): Promise<void> {
      try {
        const token = await EncryptedStorage.getItem('accessToken');
        if (!token) {
          try {
            await KakaoSDK.init(Config.KAKAO).catch(e => console.log(e));
          } catch (e) {
            console.log(e, '카카오 로그인 세팅 중 에러');
          }
        } else {
          const user = {name: '', email: '', accessToken: token};
          dispatch(userSlice.actions.setUser(user));
        }
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        resizeMode={'contain'}
        style={{width: 200, height: 200, marginBottom: 30, marginTop: 50}}
      />
      <TouchableOpacity onPress={kakaoLogin}>
        <Image
          style={styles.kakao}
          source={require('../assets/kakao-login.png')}></Image>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={styles.google}
          source={require('../assets/google-login.png')}></Image>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  kakao: {
    borderRadius: 9,
    width: 310,
    height: 50,
    resizeMode: 'contain',
  },
  google: {
    borderRadius: 20,
    width: 318,
    marginTop: 10,
    height: 55,
    resizeMode: 'stretch',
  },
});

export default Login;
