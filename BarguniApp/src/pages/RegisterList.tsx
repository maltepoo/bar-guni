import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import RegisterItems from '../components/RegisterItems';
import {FlatList, View} from 'react-native';
type RegisterListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RegisterList'
>;

function RegisterList({navigation}: ItemListScreenProps) {
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
