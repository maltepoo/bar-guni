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
import {setJwtToken} from '../api/instance';
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

function Login({navigation}: LoginScreenProps) {
  const dispatch = useAppDispatch();
  const kakaoLogin = useCallback(async () => {
    // Alert.alert(
    //   'Alert Title',
    //   'My Alert Msg',
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => Alert.alert('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //   ],
    //   {
    //     cancelable: true,
    //     onDismiss: () =>
    //       Alert.alert(
    //         'This alert was dismissed by tapping outside of the alert dialog.',
    //       ),
    //   },
    // );

    try {
      const res = (await KakaoSDK.login()) as AccessTokenType;
      console.log(res.access_token);
      if (!res.scopes.includes('account_email')) {
        await KakaoSDK.logout();
        Alert.alert('회원 가입 실패', '이메일 설정을 해주세요!');
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
      setJwtToken(data.accessToken);
      await EncryptedStorage.setItem('accessToken', data.accessToken);
    } catch (e) {
      console.log(e, '카카오 로그인 중 에러');
    }
    navigation.navigate('SignUp');
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
          setJwtToken(token);
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
        style={{width: 140, height: 140, marginBottom: 30, marginTop: 80}}
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
    marginTop: 140,
    borderRadius: 5,
    width: 220,
    resizeMode: 'stretch',
  },
  google: {
    borderRadius: 5,
    width: 318,
    marginTop: 10,
    height: 55,
    resizeMode: 'contain',
  },
});

export default Login;
