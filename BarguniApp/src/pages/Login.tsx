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
import SplashScreen from 'react-native-splash-screen';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {NavigationProp, useNavigation} from '@react-navigation/native';

function Login() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const kakaoLogin = useCallback(async () => {
    try {
      const res = (await KakaoSDK.login()) as AccessTokenType;
      console.log(res.access_token);
      if (!res.scopes.includes('account_email')) {
        await KakaoSDK.logout();
        Alert.alert('회원 가입 실패', '이메일 설정을 해주세요!');
        navigation.navigate('Login');
        return;
      }
      const data = await login(SocialType.KAKAO, res.access_token);
      console.log(data.accessToken, 'RESTAPI 발급 토큰');
      console.log(data.refreshToken, 'RESTAPI 리프레쉬 발급 토큰');
      const userProfile = await KakaoSDK.getProfile();
      const user = {
        name: userProfile.properties.nickname,
        email: userProfile.kakao_account.email,
        accessToken: data.accessToken,
      };
      console.log(user, ' 생성 받은 토큰 ');
      await EncryptedStorage.setItem('refreshToken', data.refreshToken);
      await EncryptedStorage.setItem('accessToken', data.accessToken);
      setJwtToken(data.accessToken);
      dispatch(userSlice.actions.setUser(user));
    } catch (e) {
      console.log(e, '카카오 로그인 중 에러');
    }
    // navigation.navigate('ItemList');
  }, [dispatch, navigation]);
  useEffect(() => {
    console.log('로그인 페이지');
    const init = async () => {
      try {
        await KakaoSDK.init(Config.KAKAO).catch(e => console.log(e));
      } catch (e) {
        console.log(e, '카카오 로그인 세팅 중 에러');
      }
    };
    init();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        resizeMode={'contain'}
        style={{
          flex: 0.8,
          width: '40%',
          height: '40%',
        }}
      />
      <TouchableOpacity onPress={kakaoLogin}>
        <Image source={require('../assets/kakao-login.png')} />
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
});

export default Login;
