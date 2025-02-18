import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Authentication from '../authentication';
import BottomTab from '../bottom-tab';
import MainApp from '../main-app';

const NavigationController = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="authentication">
        <Stack.Screen name="authentication" component={Authentication} />
        <Stack.Screen name="bottomTab" component={BottomTab} />
        <Stack.Screen name="mainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default NavigationController;
