import { BoxType } from './ConstantsTypes';
import { DbHive } from './supabase';
export interface AggregatedData {
  hiveCount: number;
  speciesCount: number;
  production: {
    honeyKg: number;
    propolisKg: number;
    pollenKg: number;
  };
  transactions: {
    purchasedCount: number;
    purchaseValue: number;
    soldCount: number;
    saleValue: number;
    donatedCount: number;
    lostCount: number;
  };
  actionsSummary: {
    total: number;
    inspections: number;
    transfers: number;
    feedings: number;
    harvests: number;
    maintenances: number;
    divisions: number;
  };
}
export interface ProcessedActionHistoryItem {
  id: string;
  actionId: string;
  hiveId: string;
  hiveCode?: string | null;
  beeSpeciesScientificName: string;
  boxType: string;
  actionType: string;
  date: string;
  isPending?: boolean;
  foodType?: string | null;
  qtHoney?: number | null;
  qtPollen?: number | null;
  qtPropolis?: number | null;
  queenLocated?: boolean | null;
  queenLaying?: boolean | null;
  pestsOrDiseases?: boolean | string | null;
  maintenanceAction?: string | null;
  observation?: string | null;
}
export interface ProcessedHiveListItem {
  id: string;
  userId: string;
  speciesId: number;
  speciesName: string;
  speciesScientificName: string;
  origin: string;
  acquisitionDate: string;
  hiveCode?: string | null;
  imageUrl: string;
  status?: string;
  isPending?: boolean;
}
export interface HiveDetails extends DbHive {
  speciesName: string;
  imageUrl: string;
}
export interface HiveTimelineItem {
  id: string;
  type: 'action' | 'transaction';
  date: string;
  actionType?: string;
  transactionType?: string;
  details: Record<string, any>;
  observation?: string | null;
  isPending?: boolean;
}
export interface ComboBoxItem<T = number | string> {
  id: T;
  name: string;
  [key: string]: any;
}
export interface HiveDivisionFormValues {
  actionDate: Date | null;
  motherHive1: DbHive | null;
  motherHive2: DbHive | null;
  motherHive3: DbHive | null;
  newHiveCode: string;
  newHiveBoxType: BoxType | null;
  observation: string;
}
export { BoxType };
