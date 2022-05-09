import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import TrashItem from '../components/TrashItem';
import {Checkbox} from 'react-native-paper';
import {Button} from '@rneui/base';

function TrashCan() {
  const [items, setItems] = useState([{id: 11}, {id: 22}]);
  const [checked, setChecked] = useState(false);
  const renderItem = useCallback(({item}: {item: object}) => {
    return <TrashItem item={item}></TrashItem>;
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
        />
        <Button
          title={'삭제'}
          titleStyle={Style.buttonText}
          buttonStyle={Style.remove}
        />
      </View>
      <FlatList data={items} renderItem={renderItem} />
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
  },
  restore: {marginRight: 5},
  headerText: {
    color: 'black',
    marginTop: 7,
    fontWeight: 'bold',
    width: '65%',
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  header: {flexDirection: 'row', marginTop: 10},
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default TrashCan;
