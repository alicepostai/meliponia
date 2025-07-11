import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { fonts } from '@/theme/fonts';

export default function AppLayout() {
  const { user, loading: authLoading } = useAuth();
  const { colors: themeColors, isDarkMode } = useTheme();

  if (authLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color={themeColors.honey} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  //TODO: Ajustar o estilo pra usar abaixo

  const modalScreenOptions = {
    presentation: 'modal' as const,
    headerTitleStyle: {
      color: themeColors.honey,
      fontFamily: fonts.SemiBold,
    },
    headerTintColor: themeColors.honey,
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: themeColors.headerBackground,
        },
        headerTintColor: themeColors.headerText,
        headerTitleStyle: {
          color: themeColors.headerText,
          fontFamily: fonts.SemiBold,
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="hive/[hiveId]" />
      <Stack.Screen name="hive/edit/[hiveId]" />
      <Stack.Screen name="hive/hive-registration" />
      <Stack.Screen name="hive/hive-outgoing" />
      <Stack.Screen name="hive/transfer" />
      <Stack.Screen
        name="hive/qr-codes/index"
        options={{
          title: 'QR Codes das Colmeias',
        }}
      />

      <Stack.Screen
        name="actions/division"
        options={{
          //...modalScreenOptions,
          title: 'Registrar Divisão de Enxame',
        }}
      />

      <Stack.Screen
        name="actions/feeding"
        options={{
          title: 'Registrar Alimentação',
        }}
      />
      <Stack.Screen
        name="actions/harvest"
        options={{
          title: 'Registrar Colheita',
        }}
      />
      <Stack.Screen
        name="actions/inspection"
        options={{
          title: 'Registrar Inspeção',
        }}
      />
      <Stack.Screen
        name="actions/maintenance"
        options={{
          title: 'Registrar Manutenção',
        }}
      />
      <Stack.Screen
        name="actions/box-transfer"
        options={{
          title: 'Transferência de Caixa',
        }}
      />

      <Stack.Screen
        name="settings/app-settings"
        options={{
          title: 'Configurações do Aplicativo',
        }}
      />
      <Stack.Screen
        name="settings/change-password"
        options={{
          title: 'Alterar Senha',
        }}
      />

      <Stack.Screen
        name="hive/qr-scanner/index"
        options={{
          presentation: 'modal',
          title: 'Escanear QR Code',
        }}
      />
    </Stack>
  );
}
