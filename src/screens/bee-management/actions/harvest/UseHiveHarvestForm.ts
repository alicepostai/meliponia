import { useLocalSearchParams } from 'expo-router';
import { useFormSubmission } from '@/hooks/UseFormSubmission';
import { actionService } from '@/services/ActionService';
export interface HiveHarvestFormValues {
  actionDate: Date | null;
  harvestHoney: boolean;
  honeyQuantity: string;
  harvestPollen: boolean;
  pollenQuantity: string;
  harvestPropolis: boolean;
  propolisQuantity: string;
  observation: string;
}
const parseQuantity = (quantityString: string): number | null => {
  if (!quantityString?.trim()) return null;
  const num = parseFloat(quantityString.replace(',', '.'));
  return isNaN(num) ? null : num;
};
export const useHiveHarvestForm = () => {
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const { isSubmitting, handleSubmit, handleGoBack } = useFormSubmission<HiveHarvestFormValues>({
    onSubmit: async values => {
      const harvestData = {
        qt_honey: values.harvestHoney ? parseQuantity(values.honeyQuantity) : null,
        qt_pollen: values.harvestPollen ? parseQuantity(values.pollenQuantity) : null,
        qt_propolis: values.harvestPropolis ? parseQuantity(values.propolisQuantity) : null,
        observation: values.observation.trim() || null,
      };
      return await actionService.createHarvestAction(hiveId!, harvestData, values.actionDate!);
    },
    validateBeforeSubmit: values => {
      if (!hiveId || !values.actionDate) {
        return 'Dados essenciais (colmeia, data) estão faltando.';
      }
      if (!values.harvestHoney && !values.harvestPollen && !values.harvestPropolis) {
        return 'Selecione pelo menos um item para colher.';
      }
      return true;
    },
    successMessage: 'Colheita registrada com sucesso!',
  });
  return {
    isSubmitting,
    handleSaveHarvest: handleSubmit,
    handleGoBack,
  };
};
