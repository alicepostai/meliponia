import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import HeaderActionButton from '@/components/buttons/header-action-button';
import { metrics } from '@/theme/metrics';
import { fonts } from '@/theme/fonts';

const TabHeaderRight = memo(() => {
  const router = useRouter();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        headerRightContainer: {
          flexDirection: 'row',
          marginRight: metrics.sm,
        },
      }),
    [],
  );

  const goToQrCodes = useCallback(() => {
    router.push('/(app)/hive/qr-codes');
  }, [router]);

  const goToAppSettings = useCallback(() => {
    router.push('/(app)/settings/app-settings');
  }, [router]);

  return (
    <View style={styles.headerRightContainer}>
      <HeaderActionButton
        iconName="qrcode"
        accessibilityLabel="Ler ou listar QR Codes das colmeias"
        onPress={goToQrCodes}
      />
      <HeaderActionButton
        iconName="cog-outline"
        accessibilityLabel="Configurações do aplicativo"
        onPress={goToAppSettings}
      />
    </View>
  );
});

TabHeaderRight.displayName = 'TabHeaderRight';

export default function TabLayout() {
  const { colors: themeColors, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tabBarActive,
        tabBarInactiveTintColor: themeColors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: themeColors.tabBarBackground,
          borderTopColor: isDarkMode ? themeColors.border : themeColors.lightGray,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fonts.Medium,
          marginBottom: metrics.xs / 2,
        },
        headerStyle: {
          backgroundColor: themeColors.headerBackground,
        },
        headerTintColor: themeColors.headerText,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: fonts.SemiBold,
          fontSize: metrics.xl,
          color: themeColors.headerText,
        },
        headerRight: () => <TabHeaderRight />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Colmeias',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'format-list-bulleted' : 'format-list-bulleted-type'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="general-data"
        options={{
          title: 'Dados Gerais',
          tabBarLabel: 'Dados',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'chart-box' : 'chart-box-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'map-marker' : 'map-marker-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="action-history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
