import React, {useCallback} from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function ItemDetail() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const item = {id: 1};
  const deleteItem = useCallback(() => {
    //Todo : 아이템 삭제 로직
  }, []);
  const goModify = useCallback(() => {
    navigation.navigate('ItemModify', item);
  }, [navigation, item]);

  console.log(route.params);
  return (
    <View>
      <ScrollView>
        <View style={Style.imageBox}>
          <Image
            style={Style.image}
            source={require('../assets/close.png')}></Image>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>제품명 </Text>
          <Text style={Style.description}>마데카솔</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>바구니 </Text>
          <Text style={Style.description}>B202 바구니</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>카테고리 </Text>
          <Text style={Style.description}>냉장고</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>등록일자 </Text>
          <Text style={Style.description}>2022.05.02</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>유통기한 </Text>
          <Text style={Style.description}>2022.05.02</Text>
        </View>
        <View style={Style.content}>
          <Text style={Style.title}>상세설명</Text>
          <Text style={Style.description}>
            언제 산지 모르겠음..언제 산지 모르겠음.. 언제 산지 모르겠음..언제
            산지 모르겠음..
          </Text>
        </View>
        <View style={Style.buttonContent}>
          <TouchableOpacity style={Style.modify}>
            <Text style={Style.buttonTitle} onPress={goModify}>
              수정
            </Text>
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
