import React, {useCallback} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// @ts-ignore
import logo from '../assets/loginlogo.png';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

function Login({navigation}: LoginScreenProps) {
  const onSubmit = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);
  const goSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        resizeMode={'contain'}
        style={{width: 200, height: 200, marginBottom: 20}}
      />
      <TextInput style={styles.textInput} placeholder="baguni@baguni.com" />
      <TextInput style={styles.textInput} placeholder="********" />
      <TouchableOpacity>
        <Text>비밀번호를 잊어버리셨나요?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{marginTop: 5, marginBottom: 5}}
        onPress={goSignUp}>
        <Text>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={{color: '#FFFFFF'}}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.kakaobutton}>
        <Text>카카오로 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googlebutton}>
        <Text>구글 로그인</Text>
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
  textInput: {
    padding: 5,
    marginTop: 10,
    height: 30,
    margin: 12,
    borderWidth: 1,
    width: '60%',
    textAlign: 'center',
    borderRadius: 10,
  },
  button: {
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32A3F5',
    marginBottom: 5,
    height: 25,
  },
  kakaobutton: {
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE500',
    marginBottom: 5,
    height: 25,
  },
  googlebutton: {
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F13F31',
    height: 25,
  },
});

export default Login;
