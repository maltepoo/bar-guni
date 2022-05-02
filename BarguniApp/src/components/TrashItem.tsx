import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';

function TrashItem() {
  // Todo: 상위에서 배열로 받아야할 것으로 보임
  const [checked, setChecked] = React.useState(false);
  return (
    <View style={Style.container}>
      <View style={Style.checkbox}>
        <Checkbox
          color="#0094FF"
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
      </View>
      <Image
        style={Style.image}
        source={require('../assets/loginlogo.png')}></Image>
      <View style={Style.content}>
        <View style={Style.container}>
          <Text style={Style.title}>등록 일자</Text>
          <Text style={Style.description}>등록 일자</Text>
        </View>
        <View style={Style.container}>
          <Text style={Style.title}>유통 기한</Text>
          <Text style={Style.description}>유통 기한</Text>
        </View>
        <View style={Style.container}>
          <Text style={Style.title}>등록 일자</Text>
          <Text style={Style.description}>등록 일자</Text>
        </View>
      </View>
    </View>
  );
}
const Style = StyleSheet.create({
  container: {flexDirection: 'row'},
  checkbox: {marginTop: 50},
  image: {width: 100, height: 120},
  content: {marginTop: 25, marginLeft: 20},
  title: {fontSize: 20, fontWeight: 'bold'},
  description: {marginLeft: 15, fontSize: 20},
});

export default TrashItem;
