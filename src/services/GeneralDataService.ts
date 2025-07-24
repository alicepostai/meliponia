import { supabase } from './supabase';
import { PostgrestError } from '@/types/supabase';
import { AggregatedData } from '@/types/DataTypes';
import { Alert } from 'react-native';
import { logger } from '@/utils/logger';
import { AlertService } from './AlertService';
const handleDataError = (
  error: unknown,
  context: string,
): { data: null; error: PostgrestError } => {
  const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
  logger.error(`Error during ${context}:`, error);
  AlertService.showError(errorMessage, {
    title: `Erro - ${context}`
  });
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
const fetchCount = async (fromTable: string, filter: Record<string, any> = {}): Promise<number> => {
  let query = supabase.from(fromTable).select('*', { count: 'exact', head: true });
  Object.entries(filter).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  const { count, error } = await query;
  if (error) {
    logger.warn(`Error counting ${fromTable}:`, error.message);
    return 0;
  }
  return count ?? 0;
};
export const generalDataService = {
  fetchAggregatedData: async (
    userId: string,
  ): Promise<{ data: AggregatedData | null; error: PostgrestError | null }> => {
    try {
      const [
        hiveCountRes,
        speciesDataRes,
        honeyDataRes,
        pollenDataRes,
        propolisDataRes,
        purchasedCountRes,
        purchaseValueRes,
        soldCountRes,
        saleValueRes,
        donatedCountRes,
        lostCountRes,
        totalActionsRes,
        inspectionsCountRes,
        transfersCountRes,
        feedingsCountRes,
        harvestsCountRes,
        maintenancesCountRes,
        divisionsCountRes,
      ] = await Promise.all([
        fetchCount('hive', { user_id: userId, status: 'Ativo' }),
        supabase.from('hive').select('bee_species_id').eq('user_id', userId),
        supabase.from('hive_harvest').select('qt_honey').eq('user_id', userId),
        supabase.from('hive_harvest').select('qt_pollen').eq('user_id', userId),
        supabase.from('hive_harvest').select('qt_propolis').eq('user_id', userId),
        fetchCount('hive', { user_id: userId, hive_origin: 'Compra' }),
        supabase
          .from('hive')
          .select('purchase_value')
          .eq('user_id', userId)
          .eq('hive_origin', 'Compra'),
        fetchCount('hive', { user_id: userId, status: 'Vendido' }),
        supabase
          .from('hive_transaction')
          .select('value')
          .eq('user_id', userId)
          .eq('transaction_type', 'Venda'),
        fetchCount('hive', { user_id: userId, status: 'Doado' }),
        fetchCount('hive', { user_id: userId, status: 'Perdido' }),
        fetchCount('hive_action', { user_id: userId }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Revisão' }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Transferência' }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Alimentação' }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Colheita' }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Manejo' }),
        fetchCount('hive_action', { user_id: userId, action_type: 'Divisão de Colmeia' }),
      ]);
      if (speciesDataRes.error) throw speciesDataRes.error;
      if (honeyDataRes.error) throw honeyDataRes.error;
      if (pollenDataRes.error) throw pollenDataRes.error;
      if (propolisDataRes.error) throw propolisDataRes.error;
      if (purchaseValueRes.error) throw purchaseValueRes.error;
      if (saleValueRes.error) throw saleValueRes.error;
      const speciesCount = new Set((speciesDataRes.data || []).map(item => item.bee_species_id))
        .size;

      const totalHoney = (honeyDataRes.data || []).reduce(
        (acc, item) => acc + (item.qt_honey || 0),
        0,
      );
      const totalPollen = (pollenDataRes.data || []).reduce(
        (acc, item) => acc + (item.qt_pollen || 0),
        0,
      );
      const totalPropolis = (propolisDataRes.data || []).reduce(
        (acc, item) => acc + (item.qt_propolis || 0),
        0,
      );
      const totalPurchaseValue = (purchaseValueRes.data || []).reduce(
        (acc, item) => acc + (item.purchase_value || 0),
        0,
      );
      const totalSaleValue = (saleValueRes.data || []).reduce(
        (acc, item) => acc + (item.value || 0),
        0,
      );
      const aggregatedData: AggregatedData = {
        hiveCount: hiveCountRes,
        speciesCount: speciesCount,
        production: {
          honeyKg: totalHoney || 0,
          propolisKg: totalPropolis || 0,
          pollenKg: totalPollen || 0,
        },
        transactions: {
          purchasedCount: purchasedCountRes,
          purchaseValue: totalPurchaseValue,
          soldCount: soldCountRes,
          saleValue: totalSaleValue,
          donatedCount: donatedCountRes,
          lostCount: lostCountRes,
        },
        actionsSummary: {
          total: totalActionsRes,
          inspections: inspectionsCountRes,
          transfers: transfersCountRes,
          feedings: feedingsCountRes,
          harvests: harvestsCountRes,
          maintenances: maintenancesCountRes,
          divisions: divisionsCountRes,
        },
      };
      return { data: aggregatedData, error: null };
    } catch (error) {
      return handleDataError(error, 'Buscar Dados Gerais');
    }
  },
};
