import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import AppInner from './AppInner';
import {Provider as PaperProvider} from 'react-native-paper';
import {navigationRef} from './RootNavigation';
import {Provider} from 'react-redux';
import store from './src/store';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <PaperProvider>
          <AppInner></AppInner>
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
