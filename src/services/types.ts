import { DbHive, PostgrestError } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type CreateHiveData = Pick<
  DbHive,
  | 'bee_species_id'
  | 'bee_species_scientific_name'
  | 'origin_state_loc'
  | 'box_type'
  | 'hive_origin'
  | 'acquisition_date'
  | 'hive_code'
> &
  Partial<Pick<DbHive, 'description' | 'purchase_value' | 'latitude' | 'longitude' | 'image_url'>>;

export type UpdateHiveData = Partial<Omit<DbHive, 'id' | 'created_at' | 'user_id' | 'status'>>;

export type HiveListFilter = 'Todas' | 'Ativas' | 'Vendidas' | 'Doadas' | 'Perdidas';

export interface OfflineAction {
  id: string;
  type:
    | 'createHive'
    | 'updateHive'
    | 'deleteHive'
    | 'updateProfile'
    | 'deleteAccount'
    | 'createFeedingAction'
    | 'createHarvestAction'
    | 'createInspectionAction'
    | 'createMaintenanceAction'
    | 'createTransferAction'
    | 'createHiveFromDivision'
    | 'createOutgoingTransaction'
    | 'deleteHiveAction';
  payload: any;
  createdAt: number;
}

export const handleServiceError = (
  error: unknown,
  context: string,
): { data: null; error: PostgrestError } => {
  let errorMessage = 'Ocorreu um erro desconhecido.';
  let code = '500';
  let details = '';
  let hint = '';

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      errorMessage = error.message;
    }
    if ('code' in error && typeof error.code === 'string') {
      code = error.code;
    }
    if ('details' in error && typeof error.details === 'string') {
      details = error.details;
    }
    if ('hint' in error && typeof error.hint === 'string') {
      hint = error.hint;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  logger.error(`Error during ${context}:`, error);

  return {
    data: null,
    error: {
      name: 'ServiceError',
      message: errorMessage,
      details,
      hint,
      code,
    },
  };
};

export const handleActionError = (
  error: unknown,
  context: string,
): { success: false; error: PostgrestError } => {
  let errorMessage = 'Ocorreu um erro desconhecido.';
  let code = '500';
  let details = '';
  let hint = '';

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      errorMessage = error.message;
    }
    if ('code' in error && typeof error.code === 'string') {
      code = error.code;
    }
    if ('details' in error && typeof error.details === 'string') {
      details = error.details;
    }
    if ('hint' in error && typeof error.hint === 'string') {
      hint = error.hint;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  logger.error(`Error during ${context}:`, error);

  return {
    success: false,
    error: {
      name: 'ActionError',
      message: errorMessage,
      details,
      hint,
      code,
    },
  };
};
