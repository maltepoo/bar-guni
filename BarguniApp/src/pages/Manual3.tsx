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
        <Text style={Style.header}>유통기한 임박 상품</Text>
        <Text style={Style.header}>알림을 보내드려요</Text>
      </View>
      <View style={Style.contentBox}>
        <Text style={Style.content}>
          깜빡 잊고 유통기한을 넘겨 물건을 버려보신적이
        </Text>
        <Text style={Style.content}>
          있지 않으신가요? 바구니에서는 유통기한이
        </Text>
        <Text style={Style.content}>
          임박한 상품들에 대한 알림을 보내드려요
        </Text>
      </View>
      <View style={Style.imageBox}>
        <Button title={'바구니 시작하기'} onPress={next} />
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  button: {
    backgroundColor: '#F5F4F4',
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginTop: '8%',
    marginLeft: '65%',
  },
  buttonTitle: {
    color: '#2B3944',
  },
  headerBox: {
    marginLeft: '4%',
    marginTop: '20%',
  },
  header: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 28,
    fontWeight: 'bold',
  },
  contentBox: {
    marginLeft: '4%',
    marginTop: '4%',
  },
  content: {
    fontFamily: 'Pretendard-Light',
    fontSize: 15,
    color: 'gray',
  },
  background: {
    backgroundColor: 'white',
    height: '100%',
    flex: 1,
  },
  imageBox: {
    marginTop: '85%',
  },
  image: {
    width: '70%',
    height: '60%',
    resizeMode: 'contain',
  },
});

export default Manual;
