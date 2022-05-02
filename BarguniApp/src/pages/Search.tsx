import React, {useCallback, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SearchBar from '../components/SearchBar';

function Search() {
  const [searchResult, setSearchResult] = useState([
    {id: 1, title: 'searchResult1'},
    {id: 2, title: 'searchResult2'},
    {id: 3, title: 'searchResult3'},
    {id: 4, title: 'searchResult4'},
  ]);
  const [baskets, setBaskets] = useState([
    {name: '전체'},
    {name: '바구니1'},
    {name: '바구니2'},
    {name: '바구니3'},
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = useCallback(() => {
    setModalVisible(!modalVisible);
  });

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

  const basketItem = useCallback(
    ({item}) => {
      return (
        <View style={styles.basketItem}>
          <Pressable key={item.id}>
            <Text>{item.name}</Text>
          </Pressable>
        </View>
      );
    },
    [baskets],
  );

  return (
    <>
      <SafeAreaView>
        <SearchBar handleModal={handleModal} />
        <FlatList
          data={searchResult}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Modal
          visible={modalVisible}
          animationType={'slide'}
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.category}>
              <Text style={styles.categoryTitle}>바구니선택</Text>
              <FlatList
                data={baskets}
                renderItem={basketItem}
                style={styles.basketContainer}
              />
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.cancelBtn}>
                <Text
                  style={styles.btnText}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeBtn}>
                <Text
                  style={styles.btnText}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  선택완료
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      {modalVisible ? (
        <TouchableOpacity style={styles.background}></TouchableOpacity>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'pink',
    height: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: 'black',
    margin: 10,
  },
  itemText: {
    color: 'black',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginTop: 100,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  basketContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'yellow',
    flexWrap: 'wrap',
  },
  basketItem: {
    flex: 1,
    backgroundColor: 'green',
    // borderWidth: 1,
    // borderStyle: 'solid',
    // borderColor: 'black',
  },
  category: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  categoryTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 30,
    // borderWidth: 1,
    // borderColor: 'black',
    // borderStyle: 'solid',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F0EFF2',
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 3,
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#32A3F5',
    paddingVertical: 10,
    borderRadius: 3,
  },
  btnText: {
    textAlign: 'center',
  },
});

export default Search;
