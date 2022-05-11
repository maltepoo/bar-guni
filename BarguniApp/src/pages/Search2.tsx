import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableHighlight,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../AppInner';
import NewSearchBar from '../components/NewSearchBar';
import Entypo from 'react-native-vector-icons/Entypo';

function Search2({navigation}) {
  const [searchResult, setSearchResult] = useState([
    {id: 1, title: '이전검색어'},
    {id: 2, title: '이전검색어'},
    {id: 3, title: '이전검색어'},
    {id: 4, title: '이전검색어'},
  ]);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <TouchableHighlight activeOpacity={0.6} underlayColor="#F5F4F4">
          <>
            <Entypo
              name={'back-in-time'}
              style={{
                position: 'absolute',
                left: 0,
                fontSize: 18,
                color: 'rgba(0,0,0,0.3)',
                top: '27%',
              }}
            />
            <Text style={styles.itemText}>{item.title}</Text>
          </>
        </TouchableHighlight>
      );
    },
    [searchResult],
  );

  return (
    <View style={styles.searchContainer}>
      <NewSearchBar navigation={navigation} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>검색어를 입력해주세요</Text>
      </View>

      {/*
        <FlatList
        data={searchResult}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        />
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    height: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#A09F9F',
    textAlign: 'center',
  },
  itemText: {
    color: '#A09F9F',
    lineHeight: 40,
    paddingLeft: 30,
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
  },
  cancelBtnText: {
    color: 'black',
    textAlign: 'center',
    lineHeight: 45,
  },
});

export default Search2;
