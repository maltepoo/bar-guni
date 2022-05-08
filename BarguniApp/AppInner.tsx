import React, {useCallback, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
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
import Search from './src/pages/Search2';
import SearchResult from './src/pages/SearchResult';
import AlarmSetting from './src/pages/AlarmSetting';
import MyPage from './src/pages/MyPage';
import BasketSetting from './src/pages/BasketSetting';
import TrashCan from './src/pages/TrashCan';
import Alarm from './src/pages/Alarm';
import BasketDetail from './src/pages/BasketDetail';
import * as RootNavigation from './RootNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import Login from './src/pages/Login';
import RegisterModal from './src/pages/RegisterModal';
import EncryptedStorage from 'react-native-encrypted-storage';
import HeaderRight from './src/components/HeaderRight';
import Barcode from './src/pages/Barcode';

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
  RegisterModal: undefined;
  Barcode: undefined;
};

function AppInner() {
  const isLogin = useSelector((state: RootState) => !!state.user.accessToken);
  const back = useCallback(() => {
    RootNavigation.pop();
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
            tabBarActiveTintColor: '#0094FF',
            headerShown: true,
            headerRight: () => <HeaderRight />,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="home"
                size={20}
                style={{color: focused ? '#0094FF' : ''}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="RegisterModal"
          component={RegisterModal}
          options={{
            title: '등록',
            tabBarActiveTintColor: '#0094FF',
            headerShown: true,
            headerRight: () => <HeaderRight />,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="inbox"
                size={20}
                style={{color: focused ? '#0094FF' : ''}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: '설정',
            tabBarActiveTintColor: '#0094FF',
            headerShown: true,
            headerRight: () => <HeaderRight />,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="ellipsis1"
                size={20}
                style={{color: focused ? '#0094FF' : ''}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            title: '검색',
            tabBarActiveTintColor: '#0094FF',
            headerShown: true,
            tabBarIcon: ({focused}) => (
              <AntDesign
                name="search1"
                size={20}
                style={{color: focused ? '#0094FF' : ''}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  const Stack = createNativeStackNavigator();
  return isLogin ? (
    <>
      {/*<View style={style.header}>*/}
      {/*  <Pressable onPress={back}>*/}
      {/*    <AntDesign name="left" size={20} style={style.topBarIcon} />*/}
      {/*  </Pressable>*/}
      {/*  <View>*/}
      {/*    <Pressable onPress={goSearch}>*/}
      {/*      <AntDesign name="search1" size={20} style={style.topBarIcon} />*/}
      {/*    </Pressable>*/}
      {/*    <Pressable onPress={goAlarm}>*/}
      {/*      <AntDesign name="bells" size={20} style={style.topBarIcon} />*/}
      {/*    </Pressable>*/}
      {/*  </View>*/}
      {/*</View>*/}
      <Stack.Navigator>
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="SearchResult"
          component={SearchResult}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="AlarmSetting"
          component={AlarmSetting}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="BasketSetting"
          component={BasketSetting}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="TrashCan"
          component={TrashCan}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Alarm"
          component={Alarm}
          options={{
            title: '알림',
            headerLeft: () => (
              <AntDesign
                name="left"
                size={20}
                style={style.topBarIcon}
                onPress={back}
              />
            ),
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="BasketDetail"
          component={BasketDetail}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="Barcode"
          component={Barcode}
          options={{title: '바코드로 등록하기', headerShown: true}}
        />
      </Stack.Navigator>
    </>
  ) : (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const style = StyleSheet.create({
  tinyLogo: {
    width: 40,
    height: 40,
  },
  tinyLogoLeft: {
    width: 40,
    height: 40,
    marginLeft: 240,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarIcon: {
    color: 'black',
  },
});

export default AppInner;
