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
import {changeDefaultBasket, getBaskets, getProfile} from '../api/user';
import userSlice from '../slices/user';
import {useAppDispatch} from '../store';

import {
  Basket,
  deleteBasket,
  getAlarms,
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
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import AntDesign from 'react-native-vector-icons/AntDesign';

function ItemList() {
  const user = useSelector((state: RootState) => state.user);
  const [count, setCount] = useState(0);
  const [basket, setBasket] = useState([] as Basket[]);
  const [category, setCategory] = useState([] as Category[]);
  const selectedBasket = useSelector(
    (state: RootState) => state.user.selectBasket,
  ) as Basket;
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
  const [render, setRender] = useState(false);
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
          basketName={selectedBasket.bkt_name}
          category={category[selectedCategory].name}
        />
      );
    },
    [category, remove, selectedBasket.bkt_name, selectedCategory],
  );

  useEffect(() => {
    async function init(): Promise<void> {
      try {
        console.log(init);
        const userRes = await getProfile();
        await dispatch(userSlice.actions.setUserWithoutToken(userRes));
        console.log(userRes);
        const baskets = await getBaskets();
        const index = baskets.findIndex(
          item => item.bkt_name === userRes.defaultBasket.name,
        );
        baskets.unshift(baskets[index]);
        baskets.splice(index + 1, 1);
        await setBasket(baskets);
        console.log(baskets[0], '선택 바구니 설정');
        if (selectedBasket === undefined) {
          await dispatch(userSlice.actions.setSelectBasket(baskets[0]));
        }
        const categoryRes = await getCategory(selectedBasket.bkt_id);
        await setCategory([{cateId: -1, name: '전체'}, ...categoryRes]);
        const itemRes = await getItems(selectedBasket.bkt_id, false);
        await setItems(itemRes);
        // PushNotification.localNotificationSchedule({
        //   title: '바구니에 유통기한이 지난 물품이 있는지 확인해주세요!', // (optional)
        //   message: '유통 기한이 지난 물품이 있는지 확인하러가주세요!.', // (required)
        //   channelId: 'test',
        //   date: new Date(Date.now() + 60 * 1000 * 60 * 12),
        // });
        const res = await getAlarms();
        const list = res.filter(item => item.status === 'UNCHECKED');
        setCount(list.length);
        SplashScreen.hide();
      } catch (e) {
        console.log(e);
      }
    }

    init();
  }, [dispatch, isFocused, render, selectedBasket]);
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
      setCategory([{cateId: -1, name: '전체'}, ...res]);
      setCategoryDialog(false);
      setCategoryName('');
    } catch (e) {}
  }, [selectedBasket.bkt_id, categoryName, setCategory]);

  const changeBasket = useCallback(
    async (id: number) => {
      try {
        const res = await getCategory(id);
        setCategory([{cateId: -1, name: '전체'}, ...res]);
        setSelectedCategory(0);
        const selectBasket = basket.find(item => item.bkt_id === id) as Basket;
        dispatch(userSlice.actions.setSelectBasket(selectBasket));
        const itemRes = await getItems(id, false);
        setItems(itemRes);
        console.log(id);
        console.log(itemRes);
      } catch (e) {}
    },
    [basket],
  );

  const showDeleteDialog = useCallback(
    (index: number, mode: string) => {
      setDeleteMode(mode);
      setDeleteIndex(index);
      toggleDeleteDialog();
    },
    [toggleDeleteDialog],
  );

  const removeItem = useCallback(async () => {
    console.log(basket[deleteIndex]);
    try {
      if (deleteMode === 'basket') {
        // Todo: 기본 바구니면 삭제 막아야함
        await deleteBasket(basket[deleteIndex].bkt_id);
        const res = await getBaskets();
        setBasket(res);
      } else if (deleteMode === 'category') {
        await deleteCategory(
          selectedBasket.bkt_id,
          category[deleteIndex].cateId,
        );
        const res = await getCategory(selectedBasket.bkt_id);
        setCategory(res);
      }
      toggleDeleteDialog();
    } catch (e) {
      console.log(e);
    }
  }, [
    basket,
    category,
    deleteIndex,
    deleteMode,
    selectedBasket.bkt_id,
    toggleDeleteDialog,
  ]);

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
  const setDefaultBasket = useCallback(
    async (bktId: number) => {
      try {
        console.log(bktId);
        await changeDefaultBasket(bktId);
        const res = await getProfile();
        dispatch(userSlice.actions.setUserWithoutToken(res));
        const baskets = await getBaskets();
        const index = baskets.findIndex(
          item => item.bkt_name === res.defaultBasket.name,
        );
        // baskets.unshift(baskets[index]);
        // baskets.splice(index + 1, 1);
        // console.log(baskets);
        // setBasketDialog(false);
        // setOpen(false);
        // setBasket(baskets);
        // console.log(res);
        setRender(!render);
      } catch (e) {
        console.log(e);
      }
    },
    [dispatch, render],
  );
  return (
    <View style={Style.container}>
      <View>
        <Text style={Style.topText}>{user.name}님! </Text>
        <Text style={Style.topText}>유통기한이 지난 상품이</Text>
        <Text style={Style.topText}>
          <Text style={{color: count > 0 ? '#0094FF' : ''}}>{count}</Text>개가
          있어요
        </Text>
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
            label={item.count > 1 ? item.bkt_name + ' (공유)' : item.bkt_name}
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
        <Dialog.Title titleStyle={Style.fontStyle} title="바구니 관리" />
        <ScrollView style={Style.scroll}>
          {basket.length > 0 ? (
            basket.map((item, index) => (
              <View style={Style.row} key={item.bkt_id}>
                <Text style={Style.text}>{item.bkt_name}</Text>
                <Pressable
                  style={{maginRight: 6}}
                  onPress={() => {
                    setDefaultBasket(item.bkt_id).then();
                  }}>
                  {item.bkt_name === user.defaultBasket.name ? (
                    <AntDesign name="star" size={18} />
                  ) : (
                    <AntDesign name="staro" size={18} />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    showDeleteDialog(index, 'basket');
                  }}>
                  <AntDesign name={'delete'} size={18} />
                </Pressable>
              </View>
            ))
          ) : (
            <></>
          )}
        </ScrollView>
        <TextInput
          value={basketName}
          onChangeText={onChangeBasketName}
          style={Style.newBasketInput}
          placeholder="생성할 바구니 이름을 입력하세요"
        />
        <Button onPress={addBasket} title="완료" />
        <DeleteConfirm />
      </Dialog>

      <Dialog isVisible={categoryDialog} onBackdropPress={toggleCategoryDialog}>
        <Dialog.Title titleStyle={Style.fontStyle} title="카테고리 관리" />
        <ScrollView style={Style.scroll}>
          {category.length > 0 ? (
            category.map((item, index) =>
              item.cateId !== -1 ? (
                <View style={Style.row} key={item.cateId}>
                  <Text style={Style.text}>{item.name}</Text>
                  <Pressable
                    onPress={() => {
                      showDeleteDialog(index, 'category');
                    }}>
                    <AntDesign name={'delete'} size={18} />
                  </Pressable>
                </View>
              ) : (
                <></>
              ),
            )
          ) : (
            <></>
          )}
        </ScrollView>
        <TextInput
          value={categoryName}
          onChangeText={onChangeCategoryName}
          placeholder="카테고리 이름을 입력하세요"
          style={Style.newBasketInput}
        />
        <Button onPress={addCategory} title="완료" />
        <DeleteConfirm />
      </Dialog>
    </View>
  );
}

const Style = StyleSheet.create({
  fontStyle: {
    fontFamily: 'Pretendard-Black',
  },
  modal: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: '160%',
    alignItems: 'center',
  },
  topText: {
    marginLeft: 12,
    marginTop: 3,
    fontSize: 20,
    fontFamily: 'Pretendard-Black',
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
    fontFamily: 'Pretendard-Black',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: '10%',
  },
  button: {
    backgroundColor: 'rgba(0, 148, 255, 0.15)',
    marginTop: 3,
    marginRight: 4,
    // borderWidth: 1,
    // borderColor: 'rgb(0,148,255)',
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
    fontFamily: 'Pretendard-Light',
  },
  selectButton: {
    backgroundColor: 'rgba(0, 148, 255, 0.6)',
    marginTop: 3,
    marginLeft: 4,
    // borderWidth: 1,
    borderColor: 'rgb(0,148,255)',
    height: 30,
    borderRadius: 20,
  },
  selectButtonText: {
    color: 'black',
    alignItems: 'center',
    height: 20,
    fontSize: 13,
    fontFamily: 'Pretendard-Light',
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
    marginBottom: 10,
  },
  text: {
    width: '80%',
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
  newBasketInput: {
    backgroundColor: '#F5F4F4',
    borderRadius: 100,
    paddingLeft: 20,
    marginVertical: 16,
  },
});

export default ItemList;
