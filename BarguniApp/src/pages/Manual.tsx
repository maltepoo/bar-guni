import React, {useCallback} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {Button, Text} from '@rneui/base';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function Manual() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const next = useCallback(() => {
    navigation.navigate('Manual2');
  }, [navigation]);
  return (
    <View style={Style.background}>
      <View style={Style.headerBox}>
        <Text style={Style.header}>유통기한을 관리하는</Text>
        <Text style={Style.header}>가장 효율적인 방법</Text>
      </View>
      <View style={Style.contentBox}>
        <Text style={Style.content}>제품들을 바구니에 등록하여 유통기한을</Text>
        <Text style={Style.content}>관리할 수 있어요</Text>
      </View>
      <View style={Style.imageBox}>
        <Image style={Style.image} source={require('../assets/expired.png')} />
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
