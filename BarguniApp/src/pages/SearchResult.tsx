import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import NewSearchBar from '../components/NewSearchBar';

function SearchResult({route, navigation}) {
  const {searchText} = route.params;
  const [result, setResult] = useState([]);

  useEffect(() => {
    // TODO : searchText로 api 통신해서 검색 결과 받아서 뿌려주기
    setResult([
      {id: 1, result: '검색결과1'},
      {id: 2, result: '검색결과2'},
      {id: 3, result: '검색결과3'},
      {id: 4, result: '검색결과4'},
    ]);
  }, [searchText]);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <View key={item.id} style={styles.resultContainer}>
          <Pressable>
            <Text>{item.result}</Text>
          </Pressable>
        </View>
      );
    },
    [result],
  );

  return (
    <>
      <NewSearchBar passedValue={searchText} />
      <FlatList data={result} renderItem={renderItem} />
    </>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    backgroundColor: 'pink',
    marginVertical: 4,
  },
});

export default SearchResult;
