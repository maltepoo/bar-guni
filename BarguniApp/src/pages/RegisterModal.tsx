import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, TouchableOpacity, StyleSheet, Text, Alert} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import * as RootNavigation from '../../RootNavigation';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

type RegisterModalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterModal'
>;

function RegisterModal({navigation}: RegisterModalScreenProps) {
  const email = useSelector((state: RootState) => state.user.email);
  const adminList = ['07___28@naver.com', 'ccocao@nate.com', 'da323@naver.com'];
  const byReceipt = useCallback(() => {
    // TODO : 만약 유저가 등록된 계정이면 영수증 등록으로 이동 아니면 제한
    console.log(email);
    if (adminList.includes(email)) {
      RootNavigation.navigate('ReceiptRegister', {service: 'clova'});
    } else {
      Alert.alert('준비중', '아직 준비중인 기능입니다!');
    }
  }, [adminList, email]);
  const byFreeReceipt = useCallback(() => {
    // TODO : 만약 유저가 등록된 계정이면 영수증 등록으로 이동 아니면 제한
    RootNavigation.navigate('ReceiptRegister', {service: 'us'});
  }, []);
  const byBarcode = useCallback(() => {
    navigation.navigate('Barcode');
  }, [navigation]);
  const bySelf = useCallback(() => {
    RootNavigation.navigate('Register');
  }, []);
  return (
    <View style={styles.container}>
      {adminList.includes(email) ? (
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: '#c4c4c4',
          }}
          onPress={byReceipt}>
          <Text>영수증 등록(유료)</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}

      <TouchableOpacity
        style={{...styles.button, backgroundColor: '#c4c4c4', marginTop: '55%'}}
        onPress={byFreeReceipt}>
        <Text>영수증 등록(무료)</Text>
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
