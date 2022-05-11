import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import {Item} from '../api/item';
import Config from 'react-native-config';

function ItemDetail() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const item = route.params as Item;
  const deleteItem = useCallback(() => {
    //Todo : 아이템 삭제 로직
  }, []);
  const goModify = useCallback(() => {
    navigation.navigate('ItemModify', item);
  }, [navigation, item]);

  return (
    <View style={Style.background}>
      <ScrollView>
        <View style={Style.imageBox}>
          <Image
            style={Style.image}
            source={{uri: Config.BASE_URL + item.pictureUrl}}
          />
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>제품명 </Text>
          <Text style={Style.description}>{item.name}</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>바구니 </Text>
          <Text style={Style.description}>{item.basketName} </Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>카테고리 </Text>
          <Text style={Style.description}>{item.category}</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>등록일자 </Text>
          <Text style={Style.description}>{item.regDate}</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>유통기한 </Text>
          <Text style={Style.description}>{item.usedDate}</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>상세설명</Text>
          <Text style={Style.description}>{item.content}</Text>
        </View>
        <View style={Style.buttonContent}>
          <TouchableOpacity style={Style.modify} onPress={goModify}>
            <Text style={Style.buttonTitle}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Style.delete} onPress={deleteItem}>
            <Text style={Style.buttonTitle}>삭제</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const Style = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    flex: 1,
  },
  modify: {
    backgroundColor: 'green',
    width: 50,
    height: 30,
    borderRadius: 6,
  },
  delete: {
    backgroundColor: 'red',
    width: 50,
    height: 30,
    borderRadius: 6,
    marginLeft: 5,
  },
  buttonTitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  imageBox: {
    alignItems: 'center',
    marginTop: 30,
    height: 150,
  },
  image: {
    width: '60%',
    height: '100%',
    resizeMode: 'contain',
  },
  content: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    marginLeft: 290,
    marginTop: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    width: '25%',
  },
  description: {
    fontSize: 20,
    color: 'black',
    marginTop: 3,
    marginLeft: 30,
    width: '70%',
  },
});
export default ItemDetail;
