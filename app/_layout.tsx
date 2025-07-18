import React, { useEffect, useMemo, useRef } from 'react';
import { Stack, SplashScreen, useRouter } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import FontErrorDisplay from '@/components/errors/font-error-display';
import { offlineSyncService } from '@/services/OfflineSyncService';
import { AppColorPalette } from '@/theme/colors';
import { fonts } from '@/theme/fonts';
import { AlertProvider, AlertProviderRef } from '@/components/modals/alert-provider';
import { AlertService } from '@/services/AlertService';
import { Linking } from 'react-native';
import { supabase } from '@/services/supabase';
import { DeepLinkingUtils } from '@/utils/deep-linking';
import { useAuth } from '@/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDeepLinking } from '@/hooks/UseDeepLinking';

const createPaperTheme = (themeColors: AppColorPalette, isDarkMode: boolean) => {
  return {
    ...PaperDefaultTheme,
    dark: isDarkMode,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: themeColors.honey,
      accent: themeColors.honey,
      background: themeColors.background,
      surface: themeColors.cardBackground,
      text: themeColors.text,
      placeholder: themeColors.secondary,
      error: themeColors.error,
      onSurface: themeColors.text,
      notification: themeColors.honey,
    },
  };
};

function ThemedInitialLayoutWithOnboarding() {
  const { colors: themeColors, isDarkMode } = useTheme();
  const alertProviderRef = useRef<AlertProviderRef>(null);
  const router = useRouter();
  const { session, loading } = useAuth();

  // Inicializa o sistema de deep linking
  useDeepLinking();

  const [fontsLoaded, fontError] = useFonts({
    [fonts.Bold]: require('../assets/fonts/Poppins-Bold.ttf'),
    [fonts.Light]: require('../assets/fonts/Poppins-Light.ttf'),
    [fonts.Medium]: require('../assets/fonts/Poppins-Medium.ttf'),
    [fonts.Regular]: require('../assets/fonts/Poppins-Regular.ttf'),
    [fonts.SemiBold]: require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    offlineSyncService.initialize();
    SplashScreen.preventAutoHideAsync();
    return () => {
      offlineSyncService.unsubscribe();
    };
  }, []);

  useEffect(() => {
    AlertService.setAlertProviderRef(alertProviderRef.current);
  }, []);

  useEffect(() => {
    const handleUrl = async (url: string) => {
      if (DeepLinkingUtils.isSupabaseRecoveryLink(url)) {
        await DeepLinkingUtils.processPasswordRecoveryLink(url, supabase, router);
      } else if (DeepLinkingUtils.isAppDeepLink(url) && url.includes('reset-password')) {
        router.push('/(auth)/reset-password');
      }
    };

    const handleIncomingURL = (event: { url: string }) => {
      handleUrl(event.url);
    };

    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('URL inicial encontrada:', initialUrl);
        handleUrl(initialUrl);
      }
    };

    const subscription = Linking.addEventListener('url', handleIncomingURL);

    handleInitialURL();

    return () => {
      subscription?.remove();
    };
  }, [router, session, loading]);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!session) {
      router.replace('/(auth)/login');
    } else {
      router.replace('/(app)/(tabs)');
    }
  }, [session, loading, router]);

  useEffect(() => {
    const canHideSplash = fontsLoaded || fontError;
    if (canHideSplash) {
      SplashScreen.hideAsync().catch(e => console.error('HIDING SPLASH ERROR:', e));
    }
  }, [fontsLoaded, fontError]);

  const paperTheme = useMemo(
    () => createPaperTheme(themeColors, isDarkMode),
    [isDarkMode, themeColors],
  );

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    console.error('FONT ERROR:', fontError);
    return <FontErrorDisplay error={fontError} />;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={themeColors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <AlertProvider ref={alertProviderRef} />
    </PaperProvider>
  );
}
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <OnboardingProvider>
            <PermissionProvider>
              <ThemedInitialLayoutWithOnboarding />
            </PermissionProvider>
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
