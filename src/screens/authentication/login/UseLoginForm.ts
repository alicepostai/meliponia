import { useState, useCallback, useRef } from 'react';
import { TextInput as RNTextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FormikHelpers } from 'formik';
import { authService } from '@/services/AuthService';
import { logger } from '@/utils/logger';
export interface LoginFormValues {
  email: string;
  password: string;
}
export const useLoginForm = () => {
  const router = useRouter();
  const [secureEntry, setSecureEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordInputRef = useRef<RNTextInput>(null);
  const handleSignup = useCallback(() => router.push('/(auth)/sign-up'), [router]);
  const handleForgotPassword = useCallback(
    () => router.push('/(auth)/password-recovery'),
    [router],
  );
  const toggleSecureEntry = useCallback(() => setSecureEntry(prev => !prev), []);
  const handleResendConfirmation = useCallback(async (email: string) => {
    try {
      const { error } = await authService.resendConfirmation(email);
      if (!error) {
        Alert.alert(
          'Email reenviado!',
          'Verifique sua caixa de entrada e spam para o email de confirmação.',
          [{ text: 'Entendi' }],
        );
      }
    } catch (error) {
      logger.error('Erro ao reenviar confirmação:', error);
    }
  }, []);

  const handleLogin = useCallback(
    async (values: LoginFormValues, formikActions: FormikHelpers<LoginFormValues>) => {
      setIsSubmitting(true);
      formikActions.setSubmitting(true);

      try {
        const { data, error } = await authService.signIn(values);

        setIsSubmitting(false);
        formikActions.setSubmitting(false);

        if (error) {
          if (
            error.message.toLowerCase().includes('email not confirmed') ||
            error.message.toLowerCase().includes('email address not confirmed')
          ) {
            Alert.alert(
              'Email não confirmado',
              'Você precisa confirmar seu email antes de fazer login. Verifique sua caixa de entrada e spam.',
              [
                { text: 'Reenviar Email', onPress: () => handleResendConfirmation(values.email) },
                { text: 'Entendi', style: 'cancel' },
              ],
            );
            return;
          }
          return;
        }

        if (data?.session) {
          logger.info(
            'Login bem-sucedido, session disponível - navegação será gerenciada pelo index.tsx',
          );
        } else {
          logger.info('Login processado mas sem sessão retornada');
        }
      } catch (error) {
        setIsSubmitting(false);
        formikActions.setSubmitting(false);
        logger.error('Erro inesperado no login:', error);
      }
    },
    [handleResendConfirmation],
  );
  return {
    isSubmitting,
    secureEntry,
    passwordInputRef,
    handleSignup,
    handleForgotPassword,
    toggleSecureEntry,
    handleLogin,
  };
};
