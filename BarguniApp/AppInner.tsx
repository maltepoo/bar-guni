import React, {useCallback, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import Settings from './src/pages/Settings';
import * as RootNavigation from './RootNavigation';
import SignUp from './src/pages/SignUp';
import Search from './src/pages/Search';
import AlarmSetting from './src/pages/AlarmSetting';
import MyPage from './src/pages/MyPage';
import BasketSetting from './src/pages/BasketSetting';
import TrashCan from './src/pages/TrashCan';
import Alarm from './src/pages/Alarm';
export type RootStackParamList = {
  SignIn: undefined;
  Login: undefined;
  Home: undefined;
  Search: undefined;
  Register: undefined;
  Settings: undefined;
  SignUp: undefined;
  AlarmSetting: undefined;
  MyPage: undefined;
  Alarm: undefined;
  TrashCan: undefined;
  BasketSetting: undefined;
  ItemDetail: Object;
  ItemList: undefined;
  ItemModify: Object;
};
function AppInner(props) {
  const [isLogin, setIsLogin] = useState(true);

  const back = useCallback(() => {
    RootNavigation.pop();
  }, []);
  const goAlarm = useCallback(() => {
    RootNavigation.navigate('Alarm');
  }, []);
  const goSearch = useCallback(() => {
    RootNavigation.navigate('Search');
  }, []);
  const Tab = createBottomTabNavigator();
  function BottomTab() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            title: '홈',
            tabBarActiveTintColor: 'blue',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Register"
          component={Register}
          options={{
            title: '등록',
            tabBarActiveTintColor: 'blue',
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '설정',
            tabBarActiveTintColor: 'blue',
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }
  const Stack = createNativeStackNavigator();
  return isLogin ? (
    <>
      <View style={style.header}>
        <Pressable onPress={back}>
          <Image
            style={style.tinyLogo}
            source={require('./src/assets/back.png')}></Image>
        </Pressable>
        <Pressable onPress={goSearch}>
          <Image
            style={StyleSheet.compose(style.tinyLogo, style.search)}
            source={require('./src/assets/search.png')}
          />
        </Pressable>
        <Pressable onPress={goAlarm}>
          <Image
            style={style.tinyLogo}
            source={require('./src/assets/bell.png')}></Image>
        </Pressable>
      </View>
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AlarmSetting"
          component={AlarmSetting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BasketSetting"
          component={BasketSetting}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TrashCan"
          component={TrashCan}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Alarm"
          component={Alarm}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  ) : (
    <Stack.Navigator initialRouteName="Detail">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: 'Overview'}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{title: 'Overview'}}
      />
    </Stack.Navigator>
  );
}

const style = StyleSheet.create({
  tinyLogo: {
    width: 40,
    height: 40,
  },
  search: {
    marginLeft: 280,
  },
  header: {
    flexDirection: 'row',
  },
});

export default AppInner;
