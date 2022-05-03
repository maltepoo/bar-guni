import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
    setText('');
  }, []);

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
        value={passedValue ? passedValue : text}
        onChangeText={handleText}
        onSubmitEditing={() => {
          goToSearch(text);
        }}
      />
      <Pressable style={styles.cancelBtn} onPress={removeText}>
        <Text style={styles.cancelBtnText}>취소</Text>
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
  },
  cancelBtnText: {
    color: 'black',
    textAlign: 'center',
    lineHeight: 45,
  },
});

export default NewSearchBar;
