import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import AppInner from './AppInner';

function App() {
  return (
    <NavigationContainer>
      <AppInner></AppInner>
    </NavigationContainer>
  );
}

export default App;
