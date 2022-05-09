import React, {useCallback, useEffect, useState} from 'react';
import HomeItems from '../components/HomeItems';
import {Picker} from '@react-native-picker/picker';
import {
  FlatList,
  Pressable,
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
import {
  Basket,
  deleteBasket,
  getBasketInfo,
  registerBasket,
} from '../api/basket';
import {Button, Icon, Input, SpeedDial} from '@rneui/base';
import {
  Category,
  deleteCategory,
  getCategory,
  registerCategory,
} from '../api/category';
import {getItems, Item} from '../api/item';
import {Dialog} from '@rneui/themed';
import {useIsFocused} from '@react-navigation/native';
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
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [items, setItems] = useState([] as Item[]);
  const [open, setOpen] = useState(false);
  const [basketDialog, setBasketDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [basketName, setBasketName] = useState('');
  const dispatch = useAppDispatch();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [deleteMode, setDeleteMode] = useState('');
  const isFocused = useIsFocused();
  const toggleDeleteDialog = useCallback(() => {
    setDeleteDialog(!deleteDialog);
  }, [deleteDialog]);

  const toggleBasketDialog = useCallback(() => {
    setBasketDialog(!basketDialog);
  }, [basketDialog]);

  const toggleCategoryDialog = useCallback(() => {
    setCategoryDialog(!categoryDialog);
  }, [categoryDialog]);

  const onChangeBasketName = useCallback(text => {
    setBasketName(text);
  }, []);

  const onChangeCategoryName = useCallback(text => {
    setCategoryName(text);
  }, []);

  const selectCategory = useCallback(index => {
    setSelectedCategory(index);
  }, []);

  // const remove = useCallback(index: number => {
  //   console.log(index);
  //   console.log(items, ' 아이템 들');
  //   setItems(items.filter(item => item.itemId !== index));
  // },[]);

  const remove = useCallback(
    (index: number) => {
      setItems(items.filter(item => item.itemId !== index));
    },
    [items],
  );
  const renderItem = useCallback(
    ({item}: {item: Item}) => {
      return (
        <HomeItems
          item={item}
          remove={remove}
          category={category[selectedCategory].name}
        />
      );
    },
    [category, remove, selectedCategory],
  );

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        console.log('init');
        const userRes = await getProfile();
        await dispatch(userSlice.actions.setUserName(userRes));
        const baskets = await getBaskets();
        console.log(baskets, 'baskets');
        setBasket(baskets);
        setSelectedBasket(baskets[0]);
        const categoryRes = await getCategory(baskets[0].bkt_id);
        console.log(categoryRes);
        setCategory(categoryRes);
        const itemRes = await getItems(baskets[0].bkt_id, false);
        setItems(itemRes);
        console.log(itemRes, '아이템 리스트');
      } catch (e) {
        console.log(e);
      }
    }
    init();
  }, [dispatch, isFocused]);

  const addBasket = useCallback(async () => {
    try {
      await registerBasket(basketName);
      const res = await getBaskets();
      setBasket(res);
      setBasketName('');
      setBasketDialog(false);
    } catch (e) {}
  }, [basketName]);

  const addCategory = useCallback(async () => {
    try {
      await registerCategory(selectedBasket.bkt_id, categoryName);
      const res = await getCategory(selectedBasket.bkt_id);
      setCategory(res);
      setCategoryDialog(false);
      setCategoryName('');
    } catch (e) {}
  }, [selectedBasket.bkt_id, categoryName, setCategory]);

  const changeBasket = useCallback(
    async (id: number) => {
      try {
        console.log(id);
        const res = await getCategory(id);
        console.log(res, ' 카테고리 목록들');
        setCategory(res);
        setSelectedCategory(0);
        const selectBasket = basket.find(item => item.bkt_id === id) as Basket;
        setSelectedBasket(selectBasket);
        console.log(selectBasket);
        const itemRes = await getItems(id);
        setItems(itemRes);
      } catch (e) {}
    },
    [basket],
  );

  const showDeleteDialog = useCallback(
    (index: number, mode: string) => {
      setDeleteMode(mode);
      console.log(index);
      setDeleteIndex(index);
      toggleDeleteDialog();
    },
    [toggleDeleteDialog],
  );

  const removeItem = useCallback(async () => {
    console.log(basket[deleteIndex]);
    try {
      if (deleteMode === 'basket') {
        const res2 = await deleteBasket(basket[deleteIndex].bkt_id);
        console.log(res2, ' res2');
        const res = await getBaskets();
        setBasket(res);
      } else if (deleteMode === 'category') {
        console.log(category[deleteIndex], ' 카테고리 ');
        await deleteCategory(category[deleteIndex].cateId);
        console.log(selectedBasket, ' selected Basket');
        const res = await getCategory(selectedBasket.bkt_id);
        console.log(res, 'category list');
        setCategory(res);
      }
      toggleDeleteDialog();
    } catch (e) {
      console.log(e);
    }
  }, [basket, deleteIndex, deleteMode, selectedBasket, toggleDeleteDialog]);

  const DeleteConfirm = () => {
    return (
      <Dialog isVisible={deleteDialog} onBackdropPress={toggleDeleteDialog}>
        <Dialog.Title title="정말로 삭제하시겠습니까?" />
        <View style={Style.row}>
          <View style={Style.buttonBox}>
            <Button
              title="삭제"
              onPress={removeItem}
              buttonStyle={Style.buttonBox2}
            />
          </View>
          <View style={Style.buttonBox}>
            <Button title="취소" onPress={toggleDeleteDialog} />
          </View>
        </View>
      </Dialog>
    );
  };

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
          <View />
        )}
      </ScrollView>
      <FlatList
        style={Style.list}
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
        onClose={() => setOpen(!open)}
        buttonStyle={{backgroundColor: '#32A3F5'}}>
        <SpeedDial.Action
          icon={{name: 'folder', color: '#fff'}}
          title="카테고리 관리"
          buttonStyle={{backgroundColor: '#32A3F5'}}
          onPress={() => setCategoryDialog(true)}
        />
        <SpeedDial.Action
          icon={{name: 'shopping-basket', color: '#fff'}}
          title="바구니 관리"
          buttonStyle={{backgroundColor: '#32A3F5'}}
          onPress={() => {
            setBasketDialog(true);
          }}
        />
      </SpeedDial>
      <Dialog isVisible={basketDialog} onBackdropPress={toggleBasketDialog}>
        <Dialog.Title title="바구니 관리" />
        <ScrollView style={Style.scroll}>
          {basket.length > 0 ? (
            basket.map((item, index) => (
              <View style={Style.row} key={item.bkt_id}>
                <Text style={Style.text}>{item.bkt_name}</Text>
                <Pressable
                  onPress={() => {
                    showDeleteDialog(index, 'basket');
                  }}>
                  <Icon name={'cancel'} />
                </Pressable>
              </View>
            ))
          ) : (
            <></>
          )}
        </ScrollView>
        <Input
          value={basketName}
          onChangeText={onChangeBasketName}
          placeholder="바구니 이름을 입력하세요"
        />
        <Button onPress={addBasket} title="완료" />
        <DeleteConfirm />
      </Dialog>

      <Dialog isVisible={categoryDialog} onBackdropPress={toggleCategoryDialog}>
        <Dialog.Title title="카테고리 관리" />
        <ScrollView style={Style.scroll}>
          {category.length > 0 ? (
            category.map((item, index) => (
              <View style={Style.row} key={item.cateId}>
                <Text style={Style.text}>{item.name}</Text>
                <Pressable
                  onPress={() => {
                    showDeleteDialog(index, 'category');
                  }}>
                  <Icon name={'cancel'} />
                </Pressable>
              </View>
            ))
          ) : (
            <></>
          )}
        </ScrollView>
        <Input
          value={categoryName}
          onChangeText={onChangeCategoryName}
          placeholder="카테고리 이름을 입력하세요"
        />
        <Button onPress={addCategory} title="완료" />
        <DeleteConfirm />
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
    flex: 1,
    backgroundColor: 'white',
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
    marginLeft: 10,
  },
  list: {
    height: '55%',
  },
  scroll: {
    height: 100,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    width: '90%',
  },
  buttonBox: {
    marginRight: 20,
    width: '45%',
  },
  buttonBox2: {
    marginRight: 20,
    width: '100%',
    backgroundColor: 'red',
  },
});

export default ItemList;
