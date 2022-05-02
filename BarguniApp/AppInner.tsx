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
import Search from './src/pages/Search';
import AlarmSetting from './src/pages/AlarmSetting';
import MyPage from './src/pages/MyPage';
import BasketSetting from './src/pages/BasketSetting';
import TrashCan from './src/pages/TrashCan';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
  TrashCan: undefined;
  BasketSetting: undefined;
};
function AppInner(props) {
  const [isLogin, setIsLogin] = useState(true);

  const back = useCallback(() => {
    RootNavigation.pop();
  }, []);
  const goAlarm = useCallback(() => {
    console.log(11);
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
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            title: '검색',
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
      </Stack.Navigator>
    </>
  ) : (
    <Stack.Navigator initialRouteName="Detail">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: '홈',
          tabBarIcon: () => <Entypo name="home" size={20} />,
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          title: '등록',
          tabBarIcon: () => <Ionicons name="barcode" size={22} />,
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '설정',
          tabBarIcon: () => <FontAwesome name="gear" size={20} />,
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: '검색',
          headerShown: false,
          tabBarIcon: () => <FontAwesomeIcon name="search" size={18} />,
          tabBarActiveTintColor: 'blue',
        }}
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
