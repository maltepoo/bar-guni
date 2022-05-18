import React, {useCallback, useEffect, useState} from 'react';
import RegisterItems from '../components/RegisterItems';
import {FlatList, StyleSheet, View} from 'react-native';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket} from '../api/basket';
import {Button} from '@rneui/base';
import {ItemReq, registerItem} from '../api/item';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function RegisterList({route}: any) {
  const [names, setNames] = useState(route.params);
  const [contents, setContents] = useState([] as string[]);
  const [categorys, setCategorys] = useState([] as number[]);
  const [baskets, setBaskets] = useState([] as number[]);
  const [ddays, setDdays] = useState([] as number[]);
  const [shelfLifes, setShelfLifes] = useState([] as Date[]);
  const [alertBy, setAlertBys] = useState([] as string[]);
  const [basketData, setBasketData] = useState([] as Basket[]);
  const [categoryData, setCategoryData] = useState([] as Category[]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const onSubmit = useCallback(async () => {
    console.log(names);
    for (let i = 0; i < names.length; i++) {
      const item: ItemReq = {
        bktId: baskets[i],
        cateId: categorys[i],
        name: names[i].name,
        shelfLife: shelfLifes[i].toJSON().substring(0, 10),
        alertBy: alertBy[i],
        content: contents[i],
        picId: null,
        dday: ddays[0],
      };
      console.log(item);
      //   try {
      //     await registerItem(item);
      //   } catch (e) {
      //     console.log(e);
      //   }
    }
    // navigation.navigate('ItemList');
  }, [
    alertBy,
    baskets,
    categorys,
    contents,
    ddays,
    names,
    navigation,
    shelfLifes,
  ]);
  useEffect(() => {
    async function init(): Promise<void> {
      const basketRes = await getBaskets();
      setBasketData(basketRes);
      const categoryRes = await getCategory(basketRes[0].bkt_id);
      setCategoryData(categoryRes);
      for (let i = 0; i < route.params.length; i++) {
        shelfLifes[i] = new Date();
        ddays[i] = 0;
        contents[i] = '';
        alertBy[i] = 'SHELF_LIFE';
        categorys[i] = categoryRes[0].cateId;
        baskets[i] = basketRes[0].bkt_id;
      }
    }
    init();
  }, []); // dependency 추가 안하는 게 맞음!
  useEffect(() => {}, []);
  const renderItem = useCallback(
    ({item, index}: {item: object; index: number}) => {
      return (
        <RegisterItems
          item={item}
          index={index}
          basketData={basketData}
          categoryData={categoryData}
          names={names}
          contents={contents}
          categorys={categorys}
          baskets={baskets}
          dday={ddays}
          shelfLifes={shelfLifes}
          alertBy={alertBy}
          setName={setNames}
          setContent={setContents}
          setCategory={setCategorys}
          setBaskets={setBaskets}
          setDday={setDdays}
          setShelfLifes={setShelfLifes}
          setAlertBy={setAlertBys}
        />
      );
    },
    [
      alertBy,
      basketData,
      baskets,
      categoryData,
      categorys,
      contents,
      ddays,
      names,
      shelfLifes,
    ],
  );

  return (
    <View style={Style.background}>
      <FlatList data={route.params} renderItem={renderItem} />
      <Button title={'등록'} onPress={onSubmit} />
    </View>
  );
}
const Style = StyleSheet.create({
  background: {backgroundColor: 'white', flex: 1},
});

export default RegisterList;
