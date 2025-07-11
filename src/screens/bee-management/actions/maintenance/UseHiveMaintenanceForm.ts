import { useLocalSearchParams } from 'expo-router';
import { useFormSubmission } from '@/hooks/UseFormSubmission';
import { actionService } from '@/services/ActionService';
export interface HiveMaintenanceFormValues {
  actionDate: Date | null;
  action: string;
  observation: string;
}
export const useHiveMaintenanceForm = () => {
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const { isSubmitting, handleSubmit, handleGoBack } = useFormSubmission<HiveMaintenanceFormValues>(
    {
      onSubmit: async values => {
        const maintenanceData = {
          action: values.action.trim(),
          observation: values.observation.trim() || null,
        };
        return await actionService.createMaintenanceAction(
          hiveId!,
          maintenanceData,
          values.actionDate!,
        );
      },
      validateBeforeSubmit: values => {
        if (!hiveId || !values.actionDate) {
          return !hiveId ? 'ID da colmeia não fornecido.' : 'Data é obrigatória.';
        }
        if (!values.action.trim()) {
          return 'A ação realizada é obrigatória.';
        }
        return true;
      },
      successMessage: 'Manejo registrado com sucesso!',
    },
  );
  return {
    isSubmitting,
    handleSaveMaintenance: handleSubmit,
    handleGoBack,
  };
};
