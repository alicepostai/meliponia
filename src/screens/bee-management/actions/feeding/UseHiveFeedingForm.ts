import { useFormSubmission } from '@/hooks/UseFormSubmission';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { actionService } from '@/services/ActionService';
export interface HiveFeedingFormValues {
  actionDate: Date | null;
  foodType: string;
  otherFoodType: string;
  observation: string;
}
export const useHiveFeedingForm = () => {
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const { user } = useAuth();
  const { isSubmitting, handleSubmit, handleGoBack } = useFormSubmission<HiveFeedingFormValues>({
    onSubmit: async values => {
      const finalFoodType = values.foodType === 'Outro' ? values.otherFoodType : values.foodType;
      const feedingData = {
        food_type: finalFoodType,
        observation: values.observation.trim() || null,
      };
      return await actionService.createFeedingAction(hiveId!, feedingData, values.actionDate!);
    },
    validateBeforeSubmit: values => {
      if (!user?.id || !hiveId || !values.actionDate) {
        return 'Dados essenciais (usuário, colmeia, data) estão faltando.';
      }
      return true;
    },
  });
  return {
    isSubmitting,
    handleSaveFeeding: handleSubmit,
    handleGoBack,
  };
};
