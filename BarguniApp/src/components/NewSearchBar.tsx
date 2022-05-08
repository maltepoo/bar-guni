import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

function NewSearchBar({navigation, passedValue}) {
  const [text, setText] = useState('');

  const handleText = useCallback(txt => {
    setText(txt);
    console.log(text);
  });

  const removeText = useCallback(() => {
    setText('');
    Keyboard.dismiss();
  });

  const goToSearch = useCallback(text => {
    console.log(text, 'submit text');
    navigation.navigate('SearchResult', {
      searchText: text,
    });
  });

  useEffect(() => {
    const initialText = passedValue ? passedValue : '';
    setText(initialText);
  }, []);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 10,
      }}>
      <Pressable
        style={{position: 'absolute', zIndex: 9, top: '22%', left: '3%'}}>
        <AntDesign name="search1" size={18} color="rgba(0,0,0,0.4)" />
      </Pressable>
      <TextInput
        placeholder="검색할 바구니, 물건을 입력해 주세요"
        style={styles.textINput}
        value={text}
        onChangeText={handleText}
        onSubmitEditing={() => {
          goToSearch(text);
        }}
      />
      {text ? (
        <Pressable
          style={{position: 'absolute', zIndex: 9, top: '22%', right: '3%'}}
          onPress={removeText}>
          <MaterialIcons name="cancel" size={18} color="rgba(0,0,0,0.4)" />
        </Pressable>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {},
  itemText: {
    color: 'black',
  },
  textINput: {
    width: '100%',
    height: 36,
    backgroundColor: '#F5F4F4',
    borderRadius: 100,
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

export default NewSearchBar;
