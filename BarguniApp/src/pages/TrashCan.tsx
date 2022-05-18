import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
        <View style={{flexDirection: 'row'}}>
          <Checkbox
            color="#0094FF"
            uncheckedColor={'#757575'}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }}></Checkbox>
          <Text style={Style.headerText}>전체 선택</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={restore}>
            <Text style={Style.buttonText}>복원</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={remove}>
            <Text style={Style.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
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
    marginRight: 10,
    color: 'black',
    fontFamily: 'Pretendard-Regular',
  },
  list: {
    height: '91%',
  },
  restore: {marginRight: 5},
  headerText: {
    color: 'black',
    marginTop: 7,
    fontFamily: 'Pretendard-Regular',
    marginLeft: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    color: 'black',
    marginTop: 10,
    fontFamily: 'Pretendard-Bold',
  },
  header: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default TrashCan;
