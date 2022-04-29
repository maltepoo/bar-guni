import React, {useCallback, useState} from 'react';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';
import {Text, TouchableHighlight, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './src/pages/Home';
import Register from './src/pages/Register';
import Settings from './src/pages/Settings';
import Search from './src/pages/Search';
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
};

function AppInner() {
  const [isLogin, setIsLogin] = useState([]);
  const [test, setTest] = useState(true);

  type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
  type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

  function HomeScreen({navigation}: HomeScreenProps) {
    const onClick = useCallback(() => {
      navigation.navigate('SignIn');
    }, [navigation]);

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'yellow',
        }}>
        <TouchableHighlight onPress={onClick}>
          <Text>Home Screen</Text>
        </TouchableHighlight>
      </View>
    );
  }

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  return isLogin ? (
    <Tab.Navigator>
      <Tab.Screen
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
    </Tab.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Overview'}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
