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
import {changeItemStatus, Item} from '../api/item';
import Config from 'react-native-config';

function ItemDetail() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const item = route.params as Item;
  const removeItem = useCallback(async () => {
    try {
      await changeItemStatus(item.itemId, true);
      navigation.navigate('ItemList');
    } catch (e) {
      console.log(e);
    }
  }, []);
  const goModify = useCallback(() => {
    navigation.navigate('ItemModify', item);
  }, [navigation, item]);
  console.log(item);
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
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>{item.name}</Text>
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>바구니 </Text>
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>{item.basketName} </Text>
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>카테고리 </Text>
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>{item.category}</Text>
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>등록일자 </Text>
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>{item.regDate}</Text>
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>유통기한 </Text>
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>
              {item.shelfLife === null
                ? new Date(
                    new Date().setDate(
                      new Date(item.regDate).getDate() + item.dday,
                    ),
                  )
                    .toJSON()
                    .substring(0, 10)
                : item.shelfLife}
            </Text>
          </View>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>상세설명</Text>
          <View style={Style.descriptionBox}>
            <Text style={Style.description}>{item.content}</Text>
          </View>
        </View>
        <View style={Style.buttonContent}>
          <TouchableOpacity style={Style.button} onPress={goModify}>
            <Text style={Style.buttonTitle}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={Style.button} onPress={removeItem}>
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
  button: {
    backgroundColor: '#F5F4F4',
    width: '40%',
    marginRight: '8%',
    borderRadius: 10,
  },
  buttonTitle: {
    fontSize: 20,
    color: 'rgba(43,57,68,0.5)',
    textAlign: 'center',
    marginVertical: '5%',
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
    marginLeft: '10%',
    marginTop: '5%',
  },
  buttonContent: {
    flexDirection: 'row',
    marginLeft: '11%',
    marginTop: 20,
    marginBottom: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Pretendard-Black',
    color: 'black',
    width: '25%',
  },
  description: {
    fontSize: 18,
    color: 'black',
    borderRadius: 20,
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    fontFamily: 'Pretendard-Light',
    marginLeft: '3%',
  },
  descriptionBox: {
    marginLeft: '2%',
    marginTop: '3%',
    width: '88%',
    backgroundColor: '#F5F4F4',
    borderRadius: 40,
  },
});
export default ItemDetail;
