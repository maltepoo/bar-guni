import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text} from '@rneui/base';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function Manual() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const next = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);
  return (
    <View style={Style.background}>
      <View style={Style.headerBox}>
        <Text style={Style.header}>유통기한 임박 상품에 대한</Text>
        <Text style={Style.header}>알림을 보내드려요</Text>
      </View>
      <View style={Style.contentBox}>
        <Text style={Style.content}>
          깜빡 잊고 유통기한을 넘겨 물건을 버린 적이 있나요?
        </Text>
        <Text style={Style.content}>
          바구니에서는 유통기한 임박상품 알림으로 까먹지 않게 도와줘요
        </Text>
      </View>
      <View style={Style.imageBox}>
        <Image style={Style.image} source={require('../assets/expired.png')} />
      </View>
      <Button
        title={'바구니 시작하기'}
        titleStyle={Style.buttonTitle}
        buttonStyle={Style.button}
        onPress={next}
      />
    </View>
  );
}
const Style = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#32A3F5',
  },
  headerBox: {
    flex: 1,
    marginLeft: 20,
    marginTop: 60,
  },
  header: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 30,
    flex: 1,
  },
  contentBox: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  content: {
    fontFamily: 'Pretendard-Light',
    fontSize: 15,
    color: 'gray',
  },
  imageBox: {
    flex: 4,
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '60%',
    resizeMode: 'contain',
  },
  buttonTitle: {
    color: 'white',
  },
});

export default Manual;
