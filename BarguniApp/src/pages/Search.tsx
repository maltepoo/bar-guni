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
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              모달
            </Text>
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
