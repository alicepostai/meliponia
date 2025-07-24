import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FormikHelpers } from 'formik';
import { authService } from '@/services/AuthService';
import { logger } from '@/utils/logger';
export interface SignupFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}
export const useSignupForm = () => {
  const router = useRouter();
  const [secureEntry, setSecureEntry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = useCallback(() => router.push('/(auth)/login'), [router]);
  const toggleSecureEntry = useCallback(() => setSecureEntry(prev => !prev), []);
  const handleSignup = useCallback(
    async (values: SignupFormValues, formikActions: FormikHelpers<SignupFormValues>) => {
      setIsSubmitting(true);
      formikActions.setSubmitting(true);

      try {
        const { email, password } = values;
        logger.info('UseSignUpForm: Iniciando cadastro para email:', email);

        const { data, error } = await authService.signUp({ email, password });

        setIsSubmitting(false);
        formikActions.setSubmitting(false);

        logger.info('UseSignUpForm: Resultado do cadastro:', {
          hasData: !!data,
          hasUser: !!data?.user,
          hasSession: !!data?.session,
          hasError: !!error,
          errorMessage: error?.message,
        });

        if (error) {
          logger.warn('UseSignUpForm: Erro detectado no cadastro:', error.message);

          if (
            error.message.toLowerCase().includes('user already registered') ||
            error.message.toLowerCase().includes('email already exists') ||
            error.message.toLowerCase().includes('email already taken') ||
            error.message.toLowerCase().includes('este e-mail já está cadastrado') ||
            error.message.toLowerCase().includes('email rate limit exceeded') ||
            error.message.toLowerCase().includes('signup disabled')
          ) {
            logger.warn('UseSignUpForm: Detectado erro de usuário já existente');
            Alert.alert(
              'E-mail já cadastrado',
              'Este e-mail já possui uma conta. Tente fazer login ou use outro e-mail.',
              [
                { text: 'Fazer Login', onPress: () => router.replace('/(auth)/login') },
                { text: 'Tentar Novamente', style: 'cancel' },
              ],
            );
            return;
          }
          return;
        }

        if (data?.user && !data.session) {
          Alert.alert(
            'Conta Criada!',
            'Verifique seu e-mail para confirmar sua conta antes de fazer login.',
            [{ text: 'Entendi', onPress: () => router.replace('/(auth)/login') }],
          );
        } else if (data?.session) {
          Alert.alert('Conta Criada!', 'Sua conta foi criada com sucesso!', [
            { text: 'Continuar', onPress: () => router.replace('/(app)/(tabs)') },
          ]);
        }
      } catch (error) {
        setIsSubmitting(false);
        formikActions.setSubmitting(false);
        logger.error('Erro inesperado no cadastro:', error);
      }
    },
    [router],
  );
  return {
    isSubmitting,
    secureEntry,
    handleLogin,
    toggleSecureEntry,
    handleSignup,
  };
};
