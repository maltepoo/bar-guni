import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import TrashItem from '../components/TrashItem';

function TrashCan() {
  const [items, setItems] = useState([{id: 11}, {id: 22}]);
  const renderItem = useCallback(({item}: {item: object}) => {
    return <TrashItem item={item}></TrashItem>;
  }, []);
  return (
    <View>
      <View style={Style.container}>
        <Text style={Style.title}>휴지통 페이지</Text>
      </View>
      <View style={Style.line}></View>
      <FlatList data={items} renderItem={renderItem} />
    </View>
  );
}
const Style = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  line: {width: '100%', height: 0.7, backgroundColor: 'gray'},
});
export default TrashCan;
