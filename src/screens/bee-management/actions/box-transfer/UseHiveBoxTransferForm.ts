import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { FormikHelpers, FormikProps } from 'formik';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { actionService } from '@/services/ActionService';
import { HiveBoxTransferFormValues } from './index';
export const useHiveBoxTransferForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formikRef = useRef<FormikProps<HiveBoxTransferFormValues>>(null);
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }, [router]);
  const handleSaveTransfer = async (
    values: HiveBoxTransferFormValues,
    formikActions: FormikHelpers<HiveBoxTransferFormValues>,
  ) => {
    if (!hiveId || !values.actionDate || !values.boxType) {
      Alert.alert(
        'Erro',
        !hiveId ? 'ID da colmeia não fornecido.' : 'Data e Caixa de Destino são obrigatórios.',
      );
      formikActions.setSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    formikActions.setSubmitting(true);
    const transferData = {
      box_type: values.boxType.name,
      observation: values.observation.trim() || null,
    };
    const result = await actionService.createTransferAction(
      hiveId,
      transferData,
      values.actionDate,
    );
    setIsSubmitting(false);
    formikActions.setSubmitting(false);
    if (result.success) handleGoBack();
  };
  return {
    isSubmitting,
    formikRef,
    handleSaveTransfer,
  };
};
