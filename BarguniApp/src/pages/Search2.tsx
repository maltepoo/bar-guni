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
import NewSearchBar from '../components/NewSearchBar';

function Search2({navigation}) {
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
      <NewSearchBar navigation={navigation} />
      <FlatList
        data={searchResult}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

// function NewSearchBar({navigation}) {
//   const [text, setText] = useState('');
//
//   const handleText = useCallback(txt => {
//     setText(txt);
//     console.log(text);
//   });
//
//   const removeText = useCallback(() => {
//     setText('');
//     Keyboard.dismiss();
//   });
//
//   const goToSearch = useCallback(text => {
//     console.log(text, 'submit text');
//     navigation.navigate('SearchResult', {
//       searchText: text,
//     });
//   });
//
//   return (
//     <View
//       style={{display: 'flex', flexDirection: 'row', backgroundColor: 'green'}}>
//       <Pressable
//         style={{position: 'absolute', zIndex: 9, top: '27%', left: '3%'}}>
//         <FontAwesomeIcon name="search" size={18} color="rgba(0,0,0,0.4)" />
//       </Pressable>
//       <TextInput
//         placeholder="찾으실 물건 또는 바구니를 입력해주세요."
//         style={styles.textINput}
//         value={text}
//         onChangeText={handleText}
//         onSubmitEditing={() => {
//           goToSearch(text);
//         }}
//       />
//       <Pressable style={styles.cancelBtn} onPress={removeText}>
//         <Text style={styles.cancelBtnText}>취소</Text>
//       </Pressable>
//     </View>
//   );
// }

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
  },
  cancelBtnText: {
    color: 'black',
    textAlign: 'center',
    lineHeight: 45,
  },
});

export default Search2;
