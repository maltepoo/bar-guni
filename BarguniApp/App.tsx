import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import AppInner from './AppInner';
import {navigationRef} from './RootNavigation';

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppInner></AppInner>
    </NavigationContainer>
  );
}

export default App;
