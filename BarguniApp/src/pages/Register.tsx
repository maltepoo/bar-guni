import React, {useCallback} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import RegisterItems from '../components/RegisterItems';

function Register() {
  const onClick = useCallback(() => {}, []); // 등록버튼
  return (
    <>
      <RegisterItems />
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity style={styles.button} onPress={onClick}>
          <Text>등록</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
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
export default Register;
