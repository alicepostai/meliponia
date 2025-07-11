export const STORAGE_KEYS = {
  OFFLINE_QUEUE: 'offline_action_queue',
  OFFLINE_PROFILE_UPDATES: 'offline_profile_updates',
  OFFLINE_IMAGE_UPLOADS: 'offline_image_uploads',
  USER_PREFERENCES: 'user_preferences',
  THEME_PREFERENCE: 'theme_preference',
} as const;
export const ACTION_TYPES = {
  FEEDING: 'Alimentação',
  HARVEST: 'Colheita',
  INSPECTION: 'Revisão',
  MAINTENANCE: 'Manejo',
  TRANSFER: 'Transferência',
  DIVISION: 'Divisão de Enxame',
} as const;
export const TRANSACTION_TYPES = {
  DONATION: 'Doação',
  SALE: 'Venda',
  LOSS: 'Perda',
} as const;
export const HIVE_STATUS = {
  ACTIVE: 'Ativo',
  SOLD: 'Vendido',
  DONATED: 'Doado',
  LOST: 'Perdido',
} as const;
export const HIVE_ORIGINS = {
  PURCHASE: 'Compra',
  DONATION: 'Doação',
  CAPTURE: 'Captura',
  DIVISION: 'Divisão',
} as const;
export const FOOD_TYPES = {
  SUGAR_WATER: 'Água Açucarada',
  HONEY: 'Mel',
  POLLEN: 'Pólen',
  CANDY: 'Candi',
  OTHER: 'Outro',
} as const;
export const RESERVE_LEVELS = {
  EMPTY: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;
export const NETWORK_STATE = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
} as const;
export const ROUTES = {
  TABS: '/(app)/(tabs)',
  LOGIN: '/(auth)/login',
  HIVE_REGISTRATION: '/(app)/hive/hive-registration',
  ACTIONS: {
    FEEDING: '/(app)/actions/feeding',
    HARVEST: '/(app)/actions/harvest',
    INSPECTION: '/(app)/actions/inspection',
    MAINTENANCE: '/(app)/actions/maintenance',
    TRANSFER: '/(app)/actions/box-transfer',
    DIVISION: '/(app)/actions/division',
  },
} as const;
export const ERROR_CODES = {
  OFFLINE: 'OFFLINE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;
export const FILE_EXTENSIONS = {
  IMAGES: ['jpg', 'jpeg', 'png', 'webp'],
  DOCUMENTS: ['pdf', 'doc', 'docx'],
} as const;
export const IMAGE_QUALITY = {
  LOW: 0.3,
  MEDIUM: 0.7,
  HIGH: 0.9,
} as const;
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
export const TIMEOUTS = {
  API_REQUEST: 30000,
  IMAGE_UPLOAD: 60000,
  LOCATION_REQUEST: 10000,
} as const;
export const APP_SCHEME = 'meliponia';
export const MESSAGES = {
  SUCCESS: {
    SAVE: 'Dados salvos com sucesso!',
    UPDATE: 'Dados atualizados com sucesso!',
    DELETE: 'Item excluído com sucesso!',
    UPLOAD: 'Upload realizado com sucesso!',
  },
  ERROR: {
    GENERIC: 'Ocorreu um erro inesperado. Tente novamente.',
    NETWORK: 'Verifique sua conexão com a internet.',
    VALIDATION: 'Preencha todos os campos obrigatórios.',
    NOT_FOUND: 'Item não encontrado.',
    PERMISSION: 'Permissão negada.',
  },
  OFFLINE: {
    SAVED: 'Dados salvos offline. Serão sincronizados quando você estiver online.',
    SYNC_COMPLETE: 'Sincronização concluída!',
    SYNC_ERROR: 'Erro na sincronização. Tentaremos novamente.',
  },
  LOADING: {
    GENERIC: 'Carregando...',
    SAVING: 'Salvando...',
    UPLOADING: 'Enviando...',
    SYNCING: 'Sincronizando...',
  },
} as const;
export const isValidActionType = (type: string): type is keyof typeof ACTION_TYPES => {
  return Object.values(ACTION_TYPES).includes(type as any);
};
export const isValidHiveStatus = (status: string): status is keyof typeof HIVE_STATUS => {
  return Object.values(HIVE_STATUS).includes(status as any);
};
export const isValidTransactionType = (type: string): type is keyof typeof TRANSACTION_TYPES => {
  return Object.values(TRANSACTION_TYPES).includes(type as any);
};
export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];
export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
export type HiveStatus = (typeof HIVE_STATUS)[keyof typeof HIVE_STATUS];
export type HiveOrigin = (typeof HIVE_ORIGINS)[keyof typeof HIVE_ORIGINS];
export type FoodType = (typeof FOOD_TYPES)[keyof typeof FOOD_TYPES];
export type ReserveLevel = (typeof RESERVE_LEVELS)[keyof typeof RESERVE_LEVELS];
export type NetworkState = (typeof NETWORK_STATE)[keyof typeof NETWORK_STATE];
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
