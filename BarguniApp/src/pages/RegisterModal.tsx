import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, TouchableOpacity, StyleSheet, Text, Alert} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import * as RootNavigation from '../../RootNavigation';

type RegisterModalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterModal'
>;

function RegisterModal({navigation}: RegisterModalScreenProps) {
<<<<<<< Updated upstream
  const byReceipt = useCallback(() => {
    // TODO : 만약 유저가 등록된 계정이면 영수증 등록으로 이동 아니면 제한
    if (true) {
      Alert.alert("준비중", "아직 준비중인 기능입니다!");
    } else {
      RootNavigation.navigate('Register');
=======
  const email = useSelector((state: RootState) => state.user.email);
  const adminList = ['07___28@naver.com', 'ccocao@nate.com', 'da323@naver.com'];
  const byReceipt = useCallback(() => {
    // TODO : 만약 유저가 등록된 계정이면 영수증 등록으로 이동 아니면 제한
    console.log(email);
    if (adminList.includes(email)) {
      RootNavigation.navigate('ReceiptRegister');
    } else {
      Alert.alert('준비중', '아직 준비중인 기능입니다!');
>>>>>>> Stashed changes
    }
  }, [adminList, email]);
  const byFreeReceipt = useCallback(() => {
    // TODO : 만약 유저가 등록된 계정이면 영수증 등록으로 이동 아니면 제한
    Alert.alert('준비중', '아직 준비중인 기능입니다!');
  }, []);
  const byBarcode = useCallback(() => {
    navigation.navigate('Barcode');
  }, [navigation]);
  const bySelf = useCallback(() => {
    RootNavigation.navigate('Register');
  }, []);
  return (
    <View style={styles.container}>
<<<<<<< Updated upstream
      <TouchableOpacity style={{...styles.button, backgroundColor: "#c4c4c4"}} onPress={byReceipt}>
        <Text style={{color: '#FFFFFF'}}>영수증 등록</Text>
=======
      {adminList.includes(email) ? (
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: '#c4c4c4',
            marginTop: '55%',
          }}
          onPress={byReceipt}>
          <Text style={styles.text}>영수증 등록(유료)</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <TouchableOpacity
        style={{...styles.button, backgroundColor: '#c4c4c4', marginTop: '55%'}}
        onPress={byFreeReceipt}>
        <Text style={styles.text}>영수증 등록(무료)</Text>
>>>>>>> Stashed changes
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={byBarcode}>
        <Text style={{color: '#FFFFFF'}}>바코드 등록</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={bySelf}>
        <Text style={{color: '#FFFFFF'}}>직접 등록</Text>
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
  button: {
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0094FF',
    height: 40,
    marginTop: 80,
  },
});
export default RegisterModal;
