import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '@/services/supabase';
import { View, Text } from 'react-native';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import { logger } from '@/utils/logger';
import { AlertService } from '@/services/AlertService';

export default function ConfirmEmailScreen() {
  const router = useRouter();
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      if (access_token && refresh_token) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          if (error) {
            logger.error('Erro ao confirmar email:', error);
            AlertService.showError(
              'Não foi possível confirmar seu email. Tente fazer login novamente.',
              {
                title: 'Erro na Confirmação',
                onAction: () => router.replace('/(auth)/login')
              }
            );
            return;
          }

          AlertService.showSuccess(
            'Sua conta foi confirmada com sucesso. Você já está logado!',
            {
              title: 'Email Confirmado!',
              actionText: 'Continuar',
              onAction: () => router.replace('/(app)/(tabs)')
            }
          );
        } catch (error) {
          logger.error('Erro inesperado:', error);
          AlertService.showError(
            'Ocorreu um erro inesperado. Tente fazer login novamente.',
            {
              onAction: () => router.replace('/(auth)/login')
            }
          );
        }
      } else {
        AlertService.showError(
          'O link de confirmação está inválido ou expirado.',
          {
            title: 'Link Inválido',
            onAction: () => router.replace('/(auth)/login')
          }
        );
      }
    };

    handleEmailConfirmation();
  }, [access_token, refresh_token, router]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Confirmando seu email...</Text>
      </View>
    </ScreenWrapper>
  );
}
