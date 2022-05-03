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

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

function SignUp({navigation}: SignUpScreenProps) {
  const onSubmit = useCallback(() => {}, [navigation]);
  return (
    <View style={styles.container}>
      <Image
        source={logo}
        resizeMode={'contain'}
        style={{width: 200, height: 200, marginBottom: 20}}
      />
      <TextInput style={styles.textInput} placeholder="아이디를 입력하세요" />
      <Text style={styles.text}>이메일 형식으로 입력하세요</Text>
      <TextInput style={styles.textInput} placeholder="비밀번호를 입력하세요" />
      <Text style={styles.text}>4자리 이상의 비밀번호를 입력하세요</Text>
      <TextInput style={styles.textInput} placeholder="닉네임을 입력하세요" />
      <Text style={{color: '#32A3F5'}}></Text>

      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={{color: '#FFFFFF'}}>회원가입</Text>
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
    marginTop: 5,
    height: 30,
    margin: 5,
    borderWidth: 1,
    width: '60%',
    textAlign: 'center',
    borderRadius: 10,
  },
  text: {
    color: '#32A3F5',
    marginBottom: 6,
  },
  button: {
    borderRadius: 10,
    width: '30%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#32A3F5',
    height: 25,
  },
});

export default SignUp;
