import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormikHelpers } from 'formik';
import { actionService } from '@/services/ActionService';
import { getReserveLevelText } from '@/utils/helpers';
export interface HiveInspectionFormValues {
  actionDate: Date | null;
  queenLocated: boolean;
  queenLaying: boolean;
  pestsOrDiseases: boolean;
  honeyReserve: number;
  pollenReserve: number;
  observation: string;
}
export const useHiveInspectionForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGoBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }, [router]);
  const handleSaveInspection = useCallback(
    async (
      values: HiveInspectionFormValues,
      formikActions: FormikHelpers<HiveInspectionFormValues>,
    ) => {
      if (!hiveId || !values.actionDate) {
        Alert.alert('Erro', !hiveId ? 'ID da colmeia não fornecido.' : 'Data é obrigatória.');
        return;
      }
      setIsSubmitting(true);
      formikActions.setSubmitting(true);
      const inspectionData = {
        queen_located: values.queenLocated,
        queen_laying: values.queenLaying,
        pests_or_diseases: values.pestsOrDiseases,
        honey_reserve: getReserveLevelText(values.honeyReserve),
        pollen_reserve: getReserveLevelText(values.pollenReserve),
        observation: values.observation.trim() || null,
      };
      const result = await actionService.createInspectionAction(
        hiveId,
        inspectionData,
        values.actionDate,
      );
      setIsSubmitting(false);
      formikActions.setSubmitting(false);
      if (result.success) handleGoBack();
    },
    [hiveId, handleGoBack],
  );
  return {
    isSubmitting,
    handleSaveInspection,
  };
};
