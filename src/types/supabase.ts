import {
  User as SupabaseUser,
  Session as SupabaseSession,
  AuthError as SupabaseAuthError,
  PostgrestError as SupabasePostgrestError,
} from '@supabase/supabase-js';
export type User = SupabaseUser;
export type Session = SupabaseSession;
export { SupabaseAuthError as AuthError };
export type PostgrestError = SupabasePostgrestError;
export type HiveStatus = 'Ativo' | 'Vendido' | 'Doado' | 'Perdido';
export type ActionType = 'Alimentação' | 'Colheita' | 'Revisão' | 'Manejo' | 'Transferência';
export type TransactionType = 'Venda' | 'Doação' | 'Perda';
export type ReserveLevel = 'Baixa' | 'Média' | 'Boa' | 'Ótima';
export interface DbProfile {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
}
export interface DbHive {
  id: string;
  user_id: string;
  created_at: string;
  bee_species_id: number;
  bee_species_scientific_name: string;
  origin_state_loc: string;
  box_type: string;
  hive_origin: string;
  acquisition_date: string;
  hive_code?: string | null;
  description?: string | null;
  purchase_value?: number | null;
  status?: HiveStatus | null;
  image_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}
export interface DbHiveAction {
  id: string;
  user_id: string;
  hive_id: string;
  created_at: string;
  action_type: ActionType | string;
  action_date: string;
  observation?: string | null;
  action_id?: string | null;
}
export interface DbHiveFeeding {
  id: string;
  hive_id: string;
  created_at: string;
  dt_feeding: string;
  food_type?: string | null;
  observation?: string | null;
}
export interface DbHiveHarvest {
  id: string;
  user_id: string;
  hive_id: string;
  created_at: string;
  dt_harvest: string;
  qt_honey?: number | null;
  qt_pollen?: number | null;
  qt_propolis?: number | null;
  observation?: string | null;
}
export interface DbHiveInspection {
  id: string;
  user_id: string;
  hive_id: string;
  created_at: string;
  dt_inspection: string;
  queen_located?: boolean | null;
  queen_laying?: boolean | null;
  pests_or_diseases?: boolean | string | null;
  honey_reserve?: ReserveLevel | string | null;
  pollen_reserve?: ReserveLevel | string | null;
  observation?: string | null;
}
export interface DbHiveMaintenance {
  id: string;
  hive_id: string;
  created_at: string;
  dt_maintenance: string;
  action?: string | null;
  observation?: string | null;
}
export interface DbHiveTransaction {
  id: string;
  user_id: string;
  hive_id: string;
  created_at: string;
  transaction_type: TransactionType | string;
  transaction_date: string;
  value?: number | null;
  reason?: string | null;
  observation?: string | null;
  donated_or_sold_to?: string | null;
  new_owner_contact?: string | null;
}
export interface DbHiveCompleteActionView {
  id_hive_action: string;
  feeding_id?: string | null;
  harvest_id?: string | null;
  inspection_id?: string | null;
  maintenance_id?: string | null;
  user_id: string;
  hive_id: string;
  hive_code?: string | null;
  bee_species_scientific_name?: string | null;
  box_type: string;
  action_type: string;
  action_date: string;
  observation_general?: string | null;
  food_type?: string | null;
  feeding_observation?: string | null;
  qt_honey?: number | null;
  qt_pollen?: number | null;
  qt_propolis?: number | null;
  harvest_observation?: string | null;
  queen_located?: boolean | null;
  queen_laying?: boolean | null;
  pests_or_diseases?: boolean | string | null;
  inspection_observation?: string | null;
  maintenance_action?: string | null;
  maintenance_observation?: string | null;
  action_id?: string | null;
  created_at: string;
}
export interface DatabaseSchema {
  public: {
    Tables: {
      profiles: { Row: DbProfile; Insert: Partial<DbProfile>; Update: Partial<DbProfile> };
      hive: {
        Row: DbHive;
        Insert: Partial<Omit<DbHive, 'id' | 'created_at' | 'user_id'>>;
        Update: Partial<Omit<DbHive, 'id' | 'created_at' | 'user_id'>>;
      };
      hive_action: { Row: DbHiveAction; Insert: any; Update: any };
      hive_feeding: { Row: DbHiveFeeding; Insert: any; Update: any };
      hive_harvest: { Row: DbHiveHarvest; Insert: any; Update: any };
      hive_inspection: { Row: DbHiveInspection; Insert: any; Update: any };
      hive_maintenance: { Row: DbHiveMaintenance; Insert: any; Update: any };
      hive_transaction: { Row: DbHiveTransaction; Insert: any; Update: any };
    };
    Views: {
      hive_complete_actions_view: { Row: DbHiveCompleteActionView };
    };
    Functions: {};
  };
}
