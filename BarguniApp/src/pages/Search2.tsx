import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';

function Search2() {
  return (
    <View>
      <NewSearchBar />
    </View>
  );
}

function NewSearchBar() {
  const [text, setText] = useState('');

  const handleText = useCallback(txt => {
    setText(txt);
    console.log(text);
  });

  const removeText = useCallback(() => {
    setText('');
  });

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
        value={text}
        onChangeText={handleText}
      />
      <Pressable
        style={{position: 'absolute', zIndex: 9, top: '30%', right: '20%'}}>
        <Octicons name="x" size={18} color="rgba(0,0,0,0.4)" />
      </Pressable>
      <Pressable style={styles.cancelBtn} onPress={removeText}>
        <Text>취소</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  textINput: {
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingLeft: 40,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'yellow',
    textAlign: 'center',
  },
});

export default Search2;
