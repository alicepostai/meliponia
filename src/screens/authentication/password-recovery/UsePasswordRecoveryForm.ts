import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FormikHelpers } from 'formik';
import { authService } from '@/services/AuthService';
export interface RecoveryFormValues {
  email: string;
}
export const usePasswordRecoveryForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const goToLogin = useCallback(() => router.push('/(auth)/login'), [router]);
  const handlePasswordRecovery = useCallback(
    async (values: RecoveryFormValues, formikActions: FormikHelpers<RecoveryFormValues>) => {
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      const { error } = await authService.requestPasswordRecovery(values.email);
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (!error) {
        Alert.alert(
          'Sucesso',
          'E-mail de recuperação enviado! Verifique sua caixa de entrada e spam.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }],
        );
        formikActions.resetForm();
      }
    },
    [router],
  );
  return {
    isSubmitting,
    goToLogin,
    handlePasswordRecovery,
  };
};
