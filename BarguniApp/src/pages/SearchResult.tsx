import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import NewSearchBar from '../components/NewSearchBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getItems} from '../api/item';

function SearchResult({route, navigation}) {
  const {searchText} = route.params;
  const [result, setResult] = useState([]);

  useEffect(() => {
    // TODO : searchText로 api 통신해서 검색 결과 받아서 뿌려주기
    getItemResults();
  }, []);

  const getItemResults = useCallback(async () => {
    try {
      const res = await getItems(-1);
      const newRes = res.filter(
        item =>
          item.name.includes(searchText) ||
          item.content.includes(searchText) ||
          item.category.includes(searchText),
      );
      console.log(newRes, '바꾸기');
      setResult(newRes);
    } catch (error) {
      console.log(error, 'getItem error');
    }
  }, [searchText]);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <View key={item.itemId} style={styles.resultContainer}>
          <Pressable style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              source={{uri: `http://k6b202.p.ssafy.io:8000${item.pictureUrl}`}}
              style={{backgroundColor: 'yellow', width: 100, height: 100}}
              resizeMode="cover"
            />
            <View>
              <Text>{item.category} 카테고리</Text>
              <Text>{item.name} 제품명</Text>
              <Text>{item.content} 설명</Text>
              <Text>{item.regDate} 등록날짜</Text>
              <Text>{item.shelfLife} 유통기한</Text>
            </View>
          </Pressable>
        </View>
      );
    },
    [result],
  );

  return (
    <View style={{flex: 1, paddingHorizontal: 20, backgroundColor: '#ffffff'}}>
      <NewSearchBar passedValue={searchText} />
      {result.length > 0 ? (
        <FlatList data={result} renderItem={renderItem} />
      ) : (
        <NoResult />
      )}
    </View>
  );
}

function NoResult() {
  return (
    <View style={{alignItems: 'center'}}>
      <AntDesign name={'search1'} style={{fontSize: 30, marginTop: 160}} />
      <Text style={{marginTop: 8}}>검색결과가 없습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    backgroundColor: 'pink',
    marginVertical: 4,
  },
});

export default SearchResult;
