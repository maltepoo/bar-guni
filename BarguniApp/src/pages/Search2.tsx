import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';

function Search2() {
  const [searchResult, setSearchResult] = useState([
    {id: 1, title: '이전검색어?'},
    {id: 2, title: '이전검색어'},
    {id: 3, title: '이전검색어'},
    {id: 4, title: '이전검색어'},
  ]);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <View key={item.id} style={styles.item}>
          <Pressable>
            <Text style={styles.itemText}>{item.title}</Text>
          </Pressable>
        </View>
      );
    },
    [searchResult],
  );

  return (
    <View>
      <NewSearchBar />
      <FlatList
        data={searchResult}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

function NewSearchBar() {
  const [text, setText] = useState('');

  const handleText = useCallback(txt => {
    setText(txt);
    console.log(text);
  });

  const removeText = useCallback(() => {
    setText('');
    Keyboard.dismiss();
  });

  return (
    <View
      style={{display: 'flex', flexDirection: 'row', backgroundColor: 'green'}}>
      <Pressable
        style={{position: 'absolute', zIndex: 9, top: '27%', left: '3%'}}>
        <FontAwesomeIcon name="search" size={18} color="rgba(0,0,0,0.4)" />
      </Pressable>
      <TextInput
        placeholder="찾으실 물건 또는 바구니를 입력해주세요."
        style={styles.textINput}
        value={text}
        onChangeText={handleText}
      />
      {/*<Pressable*/}
      {/*  style={{position: 'absolute', zIndex: 9, top: '30%', right: '20%'}}>*/}
      {/*  <Octicons name="x" size={18} color="rgba(0,0,0,0.4)" />*/}
      {/*</Pressable>*/}
      <Pressable style={styles.cancelBtn} onPress={removeText}>
        <Text>취소</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    height: 40,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: 'black',
    marginBottom: 10,
  },
  itemText: {
    color: 'black',
  },
  textINput: {
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingLeft: 40,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'yellow',
    textAlign: 'center',
  },
});

export default Search2;
