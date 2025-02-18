import React from 'react';
import NavigationController from './src/navigations/navigation-controller';
import {AuthProvider} from './src/contexts/AuthContext';
import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationController />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
