import React, {useCallback, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ItemList from './ItemList';
import ItemDetail from './ItemDetail';
import ItemModify from './ItemModify';

function Home() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ItemList"
        component={ItemList}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="ItemModify"
        component={ItemModify}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Home;
