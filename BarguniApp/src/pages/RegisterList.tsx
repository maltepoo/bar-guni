import React, {useCallback, useEffect, useState} from 'react';
import RegisterItems from '../components/RegisterItems';
import {FlatList, StyleSheet, View} from 'react-native';
import {getBaskets} from '../api/user';
import {Category, getCategory} from '../api/category';
import {Basket} from '../api/basket';
import {Button} from '@rneui/base';

function RegisterList({route}: any) {
  const [names, setNames] = useState(route.params);
  const [contents, setContents] = useState([] as string[]);
  const [categorys, setCategorys] = useState([] as number[]);
  const [baskets, setBaskets] = useState([] as number[]);
  const [ddays, setDdays] = useState([] as Number[]);
  const [shelfLifes, setShelfLifes] = useState([] as Date[]);
  const [alertBy, setAlertBys] = useState([] as string[]);
  const [basketData, setBasketData] = useState([] as Basket[]);
  const [categoryData, setCategoryData] = useState([] as Category[]);

  const onSubmit = useCallback(() => {
    console.log(names);
    console.log(contents);
    console.log(baskets, ' 바구니 리스트');
    console.log(categorys);
    console.log(ddays);
    console.log(shelfLifes);
    console.log(alertBy);
  }, [alertBy, baskets, categorys, contents, ddays, names, shelfLifes]);
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
  }, []);
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
