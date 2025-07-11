import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="password-recovery" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
