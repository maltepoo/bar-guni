import React, {useCallback} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {RootStackParamList} from '../../AppInner';

type RegisterModalScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterModal'
>;

function RegisterModal({navigation}: RegisterModalScreenProps) {
  const byReceipt = useCallback(() => {
    // navigation.navigate('');
  }, [navigation]);
  const byBarcode = useCallback(() => {
    // navigation.navigate('');
  }, [navigation]);
  const bySelf = useCallback(() => {
    // navigation.navigate('');
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={byReceipt}>
        <Text style={{color: '#FFFFFF'}}>영수증 등록</Text>
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
