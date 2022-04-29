import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Register from '../pages/Register';
import SignUp from '../pages/SignUp';
import Settings from '../pages/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Search from '../pages/Search';

function BottomTab() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
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

export default BottomTab;
