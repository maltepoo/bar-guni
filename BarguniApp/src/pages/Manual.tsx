import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text} from '@rneui/base';

function Manual() {
  return (
    <View style={Style.background}>
      <View>
        <Text style={Style.header}>유통기한을 관리하는</Text>
        <Text style={Style.header}>가장 효율적인 방법</Text>
      </View>
      <Text style={Style.header}>
        제품들을 바구니에 등록하여 유통기한을 관리할 수 있어요
      </Text>
      <View style={Style.imageBox}>
        <Image style={Style.image} source={require('../assets/expired.png')} />
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  header: {
    fontFamily: 'NotoSansKR-Black',
  },
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  imageBox: {
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: '60%',
    resizeMode: 'contain',
  },
});

export default Manual;
