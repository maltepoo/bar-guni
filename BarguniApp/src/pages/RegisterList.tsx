import React, {useCallback, useState} from 'react';
import RegisterItems from '../components/RegisterItems';
import {FlatList, View} from 'react-native';

function RegisterList() {
  const [items, setItems] = useState();
  const renderItem = useCallback(({item}: {item: object}) => {
    return <RegisterItems />;
  }, []);
  return (
    <View>
      <FlatList data={items} renderItem={renderItem} />
    </View>
  );
}

export default RegisterList;
