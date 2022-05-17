import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import TrashItem from '../components/TrashItem';
import {Checkbox} from 'react-native-paper';
import {Button} from '@rneui/base';
import {changeItemStatus, deleteItem, getItems, Item} from '../api/item';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
type TrashCanScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TrashCan'
>;
function TrashCan({navigation}: TrashCanScreenProps) {
  const [items, setItems] = useState([] as Item[]);
  const [checked, setChecked] = useState(false);
  const [selectList, setSelectList] = useState([] as number[]);

  const selectItem = useCallback(
    (itemId: number, check: boolean) => {
      if (check) {
        const list = selectList.filter(item => item !== itemId);
        setSelectList(list);
      } else {
        const list = [...selectList];
        list.push(itemId);
        setSelectList(list);
      }
    },
    [selectList],
  );

  const renderItem = useCallback(
    ({item}: {item: Item}) => {
      return <TrashItem select={selectItem} allSelect={checked} item={item} />;
    },
    [checked, selectItem],
  );

  const restore = useCallback(async () => {
    try {
      for (let i = 0; i < selectList.length; i++) {
        await changeItemStatus(selectList[i], false);
      }
      setSelectList([]);
      navigation.navigate('ItemList');
    } catch (e) {
      console.log(e);
    }
  }, [navigation, selectList]);

  const remove = useCallback(async () => {
    try {
      for (let i = 0; i < selectList.length; i++) {
        await deleteItem(selectList[i]);
      }
      setSelectList([]);
      navigation.navigate('ItemList');
    } catch (e) {
      console.log(e);
    }
  }, [navigation, selectList]);

  useEffect(() => {
    const init = async () => {
      const res = await getItems(-1, true);
      setItems(res);
    };
    init();
  }, []);

  return (
    <View style={Style.container}>
      <View style={Style.header}>
        <Checkbox
          color="#0094FF"
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
        <Text style={Style.headerText}>전체 선택</Text>
        <Button
          title={'복원'}
          titleStyle={Style.buttonText}
          buttonStyle={Style.restore}
          onPress={restore}
        />
        <Button
          title={'삭제'}
          titleStyle={Style.buttonText}
          buttonStyle={Style.remove}
          onPress={remove}
        />
      </View>
      <FlatList data={items} renderItem={renderItem} style={Style.list} />
    </View>
  );
}
const Style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  remove: {
    backgroundColor: 'red',
  },
  buttonText: {
    fontSize: 10,
    fontFamily: 'Pretendard-Bold',
  },
  list: {
    height: '91%',
  },
  restore: {marginRight: 5},
  headerText: {
    color: 'black',
    marginTop: 7,
    width: '65%',
    fontFamily: 'Pretendard-Bold',
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    color: 'black',
    marginTop: 10,
    fontFamily: 'Pretendard-Bold',
  },
  header: {flexDirection: 'row', marginTop: 10},
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default TrashCan;
