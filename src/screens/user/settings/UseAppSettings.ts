import { useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';
import { useTheme } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { onboardingService } from '@/services/OnboardingService';
export const useAppSettings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { refreshStatus } = useOnboarding();
  const appVersion = Constants.expoConfig?.version ?? 'N/A';

  const openLink = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Erro', `Não foi possível abrir este link: ${url}`);
    }
  }, []);

  const resetTutorial = useCallback(() => {
    Alert.alert('Reiniciar Tutorial', 'Escolha qual tutorial você gostaria de reiniciar:', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Tutorial da Lista de Colmeias',
        onPress: async () => {
          await onboardingService.resetSpecificTutorial('hive-list');
          await refreshStatus();
          Alert.alert(
            'Tutorial Reiniciado',
            'O tutorial da lista de colmeias aparecerá na próxima vez que você acessar essa tela.',
            [{ text: 'Entendi' }],
          );
        },
      },
      {
        text: 'Tutorial de QR Codes',
        onPress: async () => {
          await onboardingService.resetSpecificTutorial('qr-codes');
          await refreshStatus();
          Alert.alert(
            'Tutorial Reiniciado',
            'O tutorial de QR codes aparecerá na próxima vez que você acessar essa tela.',
            [{ text: 'Entendi' }],
          );
        },
      },
      {
        text: 'Todos os Tutoriais',
        style: 'destructive',
        onPress: async () => {
          await onboardingService.resetSpecificTutorial('hive-list');
          await onboardingService.resetSpecificTutorial('qr-codes');
          await onboardingService.resetTutorial();
          await refreshStatus();
          Alert.alert(
            'Tutoriais Reiniciados',
            'Todos os tutoriais aparecerão novamente quando você acessar as respectivas telas.',
            [{ text: 'Entendi' }],
          );
        },
      },
    ]);
  }, [refreshStatus]);

  return {
    isDarkMode,
    appVersion,
    toggleTheme,
    openLink,
    resetTutorial,
  };
};
