import React, {useCallback, useEffect, useState} from 'react';
import HomeItems from '../components/HomeItems';
import {Picker} from '@react-native-picker/picker';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RootStackParamList} from '../../AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {getBaskets, getProfile} from '../api/user';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';
import {Basket, getBasketInfo, registerBasket} from '../api/basket';
import {Button, Input, SpeedDial} from '@rneui/base';
import {Category, getCategory, registerCategory} from '../api/category';
import {getItems, Item} from '../api/item';
import {Dialog} from '@rneui/themed';
type ItemListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ItemList'
>;

function ItemList({navigation}: ItemListScreenProps) {
  const user = useSelector((state: RootState) => state.user);
  const [count, setCount] = useState(0);
  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);
  const [selectedBasket, setSelectedBasket] = useState({
    bkt_id: 0,
  });
  const [selectedCategory, setselectedCategory] = useState(0);
  const [items, setItems] = useState([] as Item[]);
  const [open, setOpen] = useState(false);
  const [basketDialog, setBasketDialog] = useState(false);
  const toggleBasketDialog = useCallback(() => {
    setBasketDialog(!basketDialog);
    setOpen(!open);
  }, []);
  const toggleCategoryDialog = useCallback(() => {
    console.log(categoryDialog);
    setCategoryDialog(!categoryDialog);
    setOpen(!open);
  }, []);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [basketName, setBasketName] = useState('');

  const onChangeBasketName = useCallback(text => {
    console.log(text);
    console.log(basketName, 'set 전 ');
    setBasketName(text);
    console.log(basketName, ' set 후 ');
  }, []);
  const onChangeCategoryName = useCallback(text => {
    setCategoryName(text);
  }, []);
  const selectCategory = useCallback(index => {
    // console.log(index);
    setselectedCategory(index);
    // Todo:카테고리를 바꾸면 아래 항목 리스트도 바뀌어야함
  }, []);
  const renderItem = useCallback(({item}: {item: Item}) => {
    console.log('renderItem', item);
    return <HomeItems item={item} />;
  }, []);
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function init(): Promise<void> {
      console.log('init');
      const userRes = await getProfile();
      await dispatch(userSlice.actions.setUserName(userRes));
      const baskets = await getBaskets();
      console.log(baskets, 'baskets');
      setBasket(baskets);
      setSelectedBasket(baskets[0]);
      const categoryRes = await getCategory(baskets[0].bkt_id);
      const categoryList = [{cateId: -1, name: '전체'}, ...categoryRes];
      setCategory(categoryList);
      const itemRes = await getItems(baskets[0].bkt_id);
      setItems(itemRes);
    }
    init();
  }, [dispatch]);
  const addBasket = useCallback(async () => {
    console.log(basketName, ' 버튼 클릭');
    // await registerBasket(basketName);
    // toggleBasketDialog();
  }, []);
  const addCategory = useCallback(async () => {
    console.log(categoryName, '카테고리네임');
    // await registerCategory(selectedBasket.bkt_id, categoryName);
    // toggleCategoryDialog();
  }, []);
  const changeBasket = useCallback(
    async (id: number) => {
      console.log(id);
      const res = await getCategory(id);
      console.log(res, ' 카테고리 목록들');
      setCategory([{cateId: -1, name: '전체'}, ...res]);
      const selectBasket = basket.find(item => item.bkt_id === id) as Basket;
      setSelectedBasket(selectBasket);
      const itemRes = await getItems(id);
      setItems(itemRes);
    },
    [basket],
  );
  return (
    <View style={Style.container}>
      <View>
        <Text style={Style.topText}>{user.name}님! </Text>
        <Text style={Style.topText}>유통기한이 지난 상품이</Text>
        <Text style={Style.topText}>{count}개가 있어요</Text>
      </View>
      <Picker
        selectedValue={selectedBasket.bkt_id}
        onValueChange={itemValue => {
          changeBasket(itemValue).then();
          //Todo: 바구니 선택시 해당 카테고리로 바꿔줘야함
        }}
        style={Style.dropdown}>
        {basket.map(item => (
          <Picker.Item
            key={item.bkt_id}
            label={item.bkt_name}
            value={item.bkt_id}
            style={Style.dropdownItem}
          />
        ))}
      </Picker>
      <ScrollView horizontal={true} style={Style.category}>
        {category.length > 0 ? (
          category.map((item, index) => (
            <Button
              title={item.name}
              buttonStyle={
                selectedCategory === index ? Style.selectButton : Style.button
              }
              onPress={() => {
                selectCategory(index);
              }}
              titleStyle={
                selectedCategory === index
                  ? Style.selectButtonText
                  : Style.buttonText
              }
              key={index}
            />
          ))
        ) : (
          <></>
        )}
      </ScrollView>
      <FlatList
        data={items}
        keyExtractor={item => item.itemId as any}
        renderItem={renderItem}
      />
      <SpeedDial
        style={Style.modal}
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={{name: 'add', color: '#fff'}}
          title="카테고리 추가"
          onPress={() => setCategoryDialog(true)}
        />
        <SpeedDial.Action
          icon={{name: 'delete', color: '#fff'}}
          title="바구니 추가"
          onPress={() => {
            setBasketDialog(true);
          }}
        />
      </SpeedDial>
      <Dialog
        isVisible={basketDialog}
        onBackdropPress={() => {
          toggleBasketDialog();
        }}>
        <Dialog.Title title="바구니 생성" />
        <TextInput
          value={basketName}
          onChangeText={onChangeBasketName}
          placeholder="바구니 이름을 입력하세요"
        />
        <Button onPress={addBasket} title="완료"></Button>
      </Dialog>
      <Dialog
        isVisible={categoryDialog}
        onBackdropPress={() => {
          toggleCategoryDialog();
        }}>
        <Dialog.Title title="카테고리 생성" />
        <Input
          value={categoryName}
          onChangeText={onChangeCategoryName}
          placeholder="카테고리 이름을 입력하세요"
        />
        <Button onPress={addCategory} title="완료"></Button>
      </Dialog>
    </View>
  );
}

const Style = StyleSheet.create({
  modal: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 750,
    alignItems: 'center',
  },
  topText: {
    marginLeft: 12,
    marginTop: 3,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdown: {
    marginTop: 20,
    color: 'black',
  },
  dropdownItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    marginTop: 10,
    marginLeft: 1,
    marginRight: 1,
  },
  button: {
    backgroundColor: 'rgba(0, 148, 255, 0.15)',
    marginTop: 3,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgb(0,148,255)',
    marginLeft: 4,
    height: 30,
    borderRadius: 20,
  },
  buttonText: {
    color: 'rgba(0,0,0,0.8)',
    borderStyle: 'solid',
    height: 20,
    alignItems: 'center',
    fontSize: 13,
  },
  selectButton: {
    backgroundColor: 'rgba(0, 148, 255, 0.6)',
    marginTop: 3,
    marginLeft: 4,
    borderWidth: 1,
    borderColor: 'rgb(0,148,255)',
    height: 30,
    borderRadius: 20,
  },
  selectButtonText: {
    color: 'black',
    alignItems: 'center',
    height: 20,
    fontSize: 13,
  },
  category: {
    flexDirection: 'row',
    marginTop: 5,
    height: 35,
    marginLeft: 10,
  },
});

export default ItemList;
