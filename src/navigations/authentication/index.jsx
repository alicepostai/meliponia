import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../../screens/authentication/login';
import PasswordRecovery from '../../screens/authentication/password-recovery';
import SignupScreen from '../../screens/authentication/sign-up';

const Authentication = () => {
    const Stack = createNativeStackNavigator();

    return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signUp" component={SignupScreen} />
        <Stack.Screen name="passwordRecovery" component={PasswordRecovery} />
    </Stack.Navigator>
    );
};

export default Authentication;
