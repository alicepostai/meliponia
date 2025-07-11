import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/contexts/AuthContext';
import { actionService } from '@/services/ActionService';
import { AlertService } from '@/services/AlertService';
export type OutgoingType = 'Doação' | 'Venda' | 'Perda';
export interface HiveOutgoingFormValues {
  outgoingType: OutgoingType | null;
  transactionDate: Date | null;
  reason: string;
  observation: string;
  donatedOrSoldTo: string;
  contact: string;
  amount: string;
}
export const useHiveOutgoingForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }, [router]);
  const handleSaveTransaction = useCallback(
    async (
      values: HiveOutgoingFormValues,
      formikActions: FormikHelpers<HiveOutgoingFormValues>,
    ) => {
      if (!user?.id || !hiveId || !values.outgoingType || !values.transactionDate) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      let valueNumber: number | null = null;
      if (values.outgoingType === 'Venda' && values.amount) {
        valueNumber = parseFloat(values.amount.replace(',', '.'));
        if (isNaN(valueNumber)) {
          Alert.alert('Valor Inválido', 'Insira um valor numérico válido para a venda.');
          setIsSubmitting(false);
          formikActions.setSubmitting(false);
          return;
        }
      }
      const transactionData = {
        value: valueNumber,
        observation: values.observation || null,
        reason: values.outgoingType === 'Perda' ? values.reason : null,
        donated_or_sold_to: values.donatedOrSoldTo || null,
        new_owner_contact: values.contact || null,
      };
      const result = await actionService.createOutgoingTransaction(
        hiveId,
        values.outgoingType,
        transactionData,
        values.transactionDate,
      );
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (result.success) {
        if (values.outgoingType === 'Venda' || values.outgoingType === 'Doação') {
          router.push(`/(app)/hive/transfer-qr/${hiveId}`);
        } else {
          handleGoBack();
        }
      } else {
        AlertService.showError('Erro ao registrar transação. Tente novamente.');
      }
    },
    [user?.id, hiveId, handleGoBack, router],
  );
  return {
    isSubmitting,
    handleSaveTransaction,
  };
};
