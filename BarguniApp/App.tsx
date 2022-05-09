import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import AppInner from './AppInner';
import {Provider as PaperProvider} from 'react-native-paper';
import {navigationRef} from './RootNavigation';
import {Provider} from 'react-redux';
import store from './src/store';
import {StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';

function App() {
  const createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'test',
        channelName: 'test',
      },
      () => {
        console.log('channelCreate');
      },
    );
  };

  useEffect(() => {
    createChannels();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <PaperProvider>
          <AppInner />
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
}
const style = StyleSheet.create({});

export default App;
