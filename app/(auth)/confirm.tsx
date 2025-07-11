import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { supabase } from '@/services/supabase';
import { View, Text } from 'react-native';
import ScreenWrapper from '@/components/ui/screen-wrapper';

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
            console.error('Erro ao confirmar email:', error);
            Alert.alert(
              'Erro na Confirmação',
              'Não foi possível confirmar seu email. Tente fazer login novamente.',
              [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
            );
            return;
          }

          Alert.alert(
            'Email Confirmado!',
            'Sua conta foi confirmada com sucesso. Você já está logado!',
            [{ text: 'Continuar', onPress: () => router.replace('/(app)/(tabs)') }],
          );
        } catch (error) {
          console.error('Erro inesperado:', error);
          Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente fazer login novamente.', [
            { text: 'OK', onPress: () => router.replace('/(auth)/login') },
          ]);
        }
      } else {
        Alert.alert('Link Inválido', 'O link de confirmação está inválido ou expirado.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
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
