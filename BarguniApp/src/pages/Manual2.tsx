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
        <Text style={Style.header}>함께 공유하는 스마트 바구니</Text>
      </View>
      <View style={Style.contentBox}>
        <Text style={Style.content}>
          가족, 친구, 동료들끼리 공유하는 물품들을
        </Text>
        <Text style={Style.content}>바구니에 담아 한번에 관리할 수 있어요</Text>
      </View>
      <View style={Style.imageBox}>
        <Image
          style={Style.image}
          source={require('../assets/wicker-basket.png')}
        />
        <Button
          title={'다음'}
          titleStyle={Style.buttonTitle}
          buttonStyle={Style.button}
          onPress={next}
        />
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
    alignItems: 'center',
    marginTop: '15%',
  },
  image: {
    width: '70%',
    height: '60%',
    resizeMode: 'contain',
  },
});

export default Manual;
