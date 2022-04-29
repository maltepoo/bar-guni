import React from 'react';
import {Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from '../components/BottomTab';

function Search() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Text>Search Screen</Text>
    </>
  );
}

export default Search;
