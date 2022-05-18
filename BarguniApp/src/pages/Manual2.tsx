import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text} from '@rneui/base';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function Manual() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const next = useCallback(() => {
    navigation.navigate('Manual3');
  }, [navigation]);
  return (
    <View style={Style.background}>
      <View style={Style.headerBox}>
        <Text style={Style.header}>가족, 친구, 동료들과 함께</Text>
        <Text style={Style.header}>공유하는 스마트 바구니</Text>
      </View>
      <View style={Style.contentBox}>
        <Text style={Style.content}>
          영수증 스캔, 바코드 스캔, 직접 입력하여
        </Text>
        <Text style={Style.content}>
          음식, 화장품, 기프티콘 등 무엇이든 관리할 수 있어요
        </Text>
      </View>
      <View style={Style.imageBox}>
        <Image
          style={Style.image}
          source={require('../assets/wicker-basket.png')}
        />
      </View>
      <Button
        title={'다음'}
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
    marginHorizontal: 20,
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
