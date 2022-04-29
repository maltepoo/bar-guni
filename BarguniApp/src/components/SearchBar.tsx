import React, {useCallback} from 'react';
import {Alert, Pressable, StyleSheet, TextInput, View} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

function SearchBar() {
  const handleSearch = useCallback(() => {
    Alert.alert('검색한다');
  });

  return (
    <View style={styles.searchWrapper}>
      <View style={{position: 'relative'}}>
        <Pressable style={styles.searchIcon} onPress={handleSearch}>
          <FontAwesomeIcon name="search" size={18} color="rgba(0,0,0,0.4)" />
        </Pressable>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력해주세요"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    backgroundColor: '#32A3F5',
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  searchIcon: {
    position: 'absolute',
    zIndex: 2,
    left: 12,
    top: 10,
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingLeft: 40,
  },
});

export default SearchBar;
