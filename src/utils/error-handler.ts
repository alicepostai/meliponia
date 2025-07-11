import { PostgrestError } from '@/types/supabase';
import { AlertService } from '@/services/AlertService';
import NetInfo from '@react-native-community/netinfo';

export const createErrorHandler = (defaultContext: string) => {
  return (error: unknown, context?: string): { success: false; error: PostgrestError } => {
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    const finalContext = context || defaultContext;
    console.error(`Error during ${finalContext}:`, error);
    AlertService.showError(errorMessage);
    return {
      success: false,
      error: {
        message: errorMessage,
        details: '',
        hint: '',
        code: '500',
        name: '',
      },
    };
  };
};

export const createDataErrorHandler = (defaultContext: string) => {
  return (error: unknown, context?: string): { data: null; error: PostgrestError } => {
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    const finalContext = context || defaultContext;
    console.error(`Error during ${finalContext}:`, error);
    AlertService.showError(errorMessage);
    return {
      data: null,
      error: {
        message: errorMessage,
        details: '',
        hint: '',
        code: '500',
        name: '',
      },
    };
  };
};

export const checkOfflineAndHandle = async (
  forceOnline: boolean,
  onOffline: () => Promise<any>,
) => {
  const netState = await NetInfo.fetch();
  if (!forceOnline && (!netState.isConnected || !netState.isInternetReachable)) {
    return await onOffline();
  }
  return null;
};
