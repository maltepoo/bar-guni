import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function Search() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Text>Search Screen</Text>
    </>
  );
}

export default Search;
