<<<<<<< HEAD
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
} from 'react-native';
import SearchBar from '../components/SearchBar';

function Search() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleModal = useCallback(() => {
    setModalVisible(!modalVisible);
  });

  return (
    <>
      <SafeAreaView>
        <SearchBar />
        <Text onPress={handleModal}>모달열기</Text>
        <Modal
          visible={modalVisible}
          animationType={'slide'}
          transparent={true}>
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.hideButton}
              onPress={handleModal}></Pressable>
            <Text
              style={{
                color: 'white',
                backgroundColor: 'black',
                padding: 10,
                width: 120,
                marginLeft: 10,
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              모달
            </Text>
            <View style={styles.category}>
              <Text>바구니선택</Text>
              <Text>카테고리 선택</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      {modalVisible ? (
        <TouchableOpacity style={styles.background}></TouchableOpacity>
      ) : null}
=======
import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from '../components/BottomTab';

function Search() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Text>Search Screen</Text>
>>>>>>> develop
    </>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 200,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  category: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  hideButton: {
    marginTop: 10,
    marginLeft: '35%',
    width: 120,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 100,
  },
});

export default Search;
