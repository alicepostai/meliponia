import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { FormikHelpers } from 'formik';
import { useCommonNavigation } from './UseCommonNavigation';
interface UseFormSubmissionOptions<T> {
  onSubmit: (values: T, actions: FormikHelpers<T>) => Promise<{ success: boolean }>;
  onSuccess?: () => void;
  successMessage?: string;
  validateBeforeSubmit?: (values: T) => boolean | string;
}

export const useFormSubmission = <T>({
  onSubmit,
  onSuccess,
  successMessage = 'Operação realizada com sucesso!',
  validateBeforeSubmit,
}: UseFormSubmissionOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleGoBack } = useCommonNavigation();
  const handleSubmit = useCallback(
    async (values: T, formikActions: FormikHelpers<T>) => {
      if (validateBeforeSubmit) {
        const validationResult = validateBeforeSubmit(values);
        if (validationResult !== true) {
          const errorMessage =
            typeof validationResult === 'string'
              ? validationResult
              : 'Preencha todos os campos obrigatórios.';
          Alert.alert('Dados Inválidos', errorMessage);
          return;
        }
      }
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      try {
        const result = await onSubmit(values, formikActions);
        if (result.success) {
          if (successMessage) {
            Alert.alert('Sucesso!', successMessage);
          }
          if (onSuccess) {
            onSuccess();
          } else {
            handleGoBack();
          }
        }
      } catch (error) {
        console.error('Error in form submission:', error);
        Alert.alert('Erro Inesperado', 'Ocorreu um problema. Tente novamente em alguns instantes.');
      } finally {
        setIsSubmitting(false);
        formikActions.setSubmitting(false);
      }
    },
    [onSubmit, onSuccess, successMessage, validateBeforeSubmit, handleGoBack],
  );
  return {
    isSubmitting,
    handleSubmit,
    handleGoBack,
  };
};
