import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import NewSearchBar from '../components/NewSearchBar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getItems} from '../api/item';
import Config from 'react-native-config';

function SearchResult({route, navigation}) {
  const {searchText} = route.params;
  const [result, setResult] = useState([]);

  useEffect(() => {
    // TODO : searchText로 api 통신해서 검색 결과 받아서 뿌려주기
    getItemResults();
  }, [getItemResults]);

  const getItemResults = useCallback(async () => {
    try {
      const res = await getItems(-1);
      const newRes = res.filter(
        item =>
          !!item.name &&
          (item.name.includes(searchText) ||
            item.content.includes(searchText) ||
            item.category.includes(searchText)),
      );
      setResult(newRes);
    } catch (error) {
      console.log(error, 'getItem error');
    }
  }, [searchText]);

  const renderItem = useCallback(({item}) => {
    return (
      <View key={item.itemId} style={styles.resultContainer}>
        <Pressable style={{display: 'flex', flexDirection: 'row'}}>
          <Image
            source={{uri: Config.BASE_URL + item.pictureUrl}}
            style={{width: 100, height: 100, borderRadius: 8}}
            resizeMode="cover"
          />
          <View style={{marginLeft: 10}}>
            <Text>{item.category}</Text>
            <Text style={{fontFamily: 'Pretendard-Bold', fontSize: 20}}>
              {item.name}
            </Text>
            <Text style={{fontSize: 12}}>{item.content}</Text>
            <Text style={{fontSize: 14}}>{item.regDate} 등록</Text>
            <Text style={{fontSize: 14}}>{item.shelfLife} 까지</Text>
          </View>
        </Pressable>
        <View style={styles.line} />
      </View>
    );
  }, []);

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
      <AntDesign
        name={'search1'}
        style={{fontSize: 30, marginTop: 160, color: '#000'}}
      />
      <Text style={{marginTop: 8, color: '#000'}}>검색결과가 없습니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    // backgroundColor: 'pink',
    borderRadius: 8,
    marginVertical: 6,
  },
  line: {
    height: 0.7,
    backgroundColor: '#F5F4F4',
    marginTop: 8,
  },
});

export default SearchResult;
