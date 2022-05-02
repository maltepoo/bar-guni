import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import AppInner from './AppInner';
import {Provider as PaperProvider} from 'react-native-paper';
import {navigationRef} from './RootNavigation';

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <PaperProvider>
        <AppInner></AppInner>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default App;
