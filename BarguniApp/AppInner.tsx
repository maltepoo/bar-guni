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

function AppInner(props) {
  const [isLogin, setIsLogin] = useState([]);
  const [test, setTest] = useState(true);
  type RootStackParamList = {
    SignIn: undefined;
    Login: undefined;
    Home: undefined;
    Search: undefined;
    Register: undefined;
    Settings: undefined;
  };

  type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
  type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

  function HomeScreen({navigation}: HomeScreenProps) {
    const onClick = useCallback(() => {
      navigation.navigate('SignIn');
    }, [navigation]);

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight onPress={onClick}>
          <Text>Home Screen</Text>
        </TouchableHighlight>
      </View>
    );
  }

  function DetailsScreen({navigation}: DetailsScreenProps) {
    const onClick = useCallback(() => {
      navigation.navigate('Home');
    }, [navigation]);

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableHighlight onPress={onClick}>
          <Text>Details Screen</Text>
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
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Register"
        component={Register}
        options={{
          title: '등록',
          tabBarActiveTintColor: 'blue',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: '설정',
          tabBarActiveTintColor: 'blue',
        }}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Details">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Overview'}}
      />
      <Stack.Screen name="Details">
        {props => <DetailsScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default AppInner;
