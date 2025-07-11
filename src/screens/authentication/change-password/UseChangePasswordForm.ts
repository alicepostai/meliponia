import { useState, useCallback, useRef } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { FormikHelpers } from 'formik';
import { authService } from '@/services/AuthService';
export interface ChangePasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}
export const useChangePasswordForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secureNewEntry, setSecureNewEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const confirmPasswordInputRef = useRef<RNTextInput>(null);
  const toggleSecureNewEntry = useCallback(() => setSecureNewEntry(prev => !prev), []);
  const toggleSecureConfirmEntry = useCallback(() => setSecureConfirmEntry(prev => !prev), []);
  const handleChangePassword = useCallback(
    async (
      values: ChangePasswordFormValues,
      formikActions: FormikHelpers<ChangePasswordFormValues>,
    ) => {
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      const { error } = await authService.updateUserPassword(values.newPassword);
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (!error) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(app)/(tabs)/profile');
        }
      }
    },
    [router],
  );
  return {
    isSubmitting,
    secureNewEntry,
    secureConfirmEntry,
    confirmPasswordInputRef,
    toggleSecureNewEntry,
    toggleSecureConfirmEntry,
    handleChangePassword,
  };
};
