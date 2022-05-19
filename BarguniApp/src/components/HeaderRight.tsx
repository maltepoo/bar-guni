import React, {useCallback} from 'react';
import * as RootNavigation from '../../RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StyleSheet, View} from 'react-native';

function HeaderRight() {
  const goAlarm = useCallback(() => {
    RootNavigation.navigate('Alarm');
  }, []);
  const goSearch = useCallback(() => {
    RootNavigation.navigate('Search');
  }, []);
  return (
    <View style={{flexDirection: 'row'}}>
      <AntDesign
        name="search1"
        size={20}
        style={styles.topBarIcon}
        onPress={goSearch}
      />
      <AntDesign
        name="bells"
        size={20}
        style={styles.topBarIcon}
        onPress={goAlarm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBarIcon: {
    color: 'black',
  },
});

export default HeaderRight;
