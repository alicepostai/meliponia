import {
  DbHive,
  DbHiveAction,
  DbHiveTransaction,
  DbHiveFeeding,
  DbHiveHarvest,
  DbHiveInspection,
  DbHiveMaintenance,
} from '@/types/supabase';
import { HiveDetails, HiveTimelineItem, ProcessedHiveListItem } from '@/types/DataTypes';
import { getBeeNameById, getBeeImageUrlById, formatCurrency, formatWeightGrams } from './helpers';
import { supabase } from '@/services/supabase';
export const processHiveDataForList = (hives: DbHive[] | null): ProcessedHiveListItem[] => {
  if (!hives) return [];
  return hives
    .map(hive => ({
      id: String(hive.id),
      userId: hive.user_id,
      speciesId: hive.bee_species_id,
      speciesName: getBeeNameById(hive.bee_species_id),
      speciesScientificName: hive.bee_species_scientific_name,
      origin: hive.hive_origin,
      acquisitionDate: hive.acquisition_date,
      hiveCode: hive.hive_code,
      imageUrl: getBeeImageUrlById(hive.bee_species_id),
      status: hive.status ?? 'Ativo',
      isPending: hive.id.startsWith('offline_'),
    }))
    .filter(Boolean) as ProcessedHiveListItem[];
};
export const processHiveDetails = (hive: DbHive | null): HiveDetails | null => {
  if (!hive) return null;
  return {
    ...hive,
    speciesName: getBeeNameById(hive.bee_species_id),
    imageUrl: hive.image_url || getBeeImageUrlById(hive.bee_species_id),
  };
};
const fetchActionDetails = async (actionType: string, actionId: string | null | undefined) => {
  if (!actionId) return {};
  const tableNameMap: Record<string, string> = {
    Alimentação: 'hive_feeding',
    Colheita: 'hive_harvest',
    Revisão: 'hive_inspection',
    Manejo: 'hive_maintenance',
  };
  const tableName = tableNameMap[actionType];
  if (!tableName) return {};
  try {
    const { data, error } = await supabase.from(tableName).select('*').eq('id', actionId).single();
    if (error) {
      console.warn(
        `Erro ao buscar detalhes da ação ${actionType} (ID: ${actionId}):`,
        error.message,
      );
      return {};
    }
    return data || {};
  } catch (e) {
    console.error(`Exceção ao buscar detalhes da ação ${actionType}:`, e);
    return {};
  }
};
export const processTimelineData = async (
  items: (DbHiveAction | DbHiveTransaction)[] | null,
): Promise<HiveTimelineItem[]> => {
  if (!items) return [];
  const processedItems = await Promise.all(
    items.map(async (item): Promise<HiveTimelineItem | null> => {
      try {
        const isAction = 'action_type' in item;
        const date = isAction ? item.action_date : item.transaction_date;
        const actionType = isAction ? item.action_type : undefined;
        const transactionType = !isAction ? item.transaction_type : undefined;

        let finalDate = date || item.created_at;
        if (finalDate) {
          const dateObj = new Date(finalDate);
          const localHours = dateObj.getHours();
          const localMinutes = dateObj.getMinutes();

          if (localHours === 0 && localMinutes === 0) {
            const createdAt = new Date(item.created_at);

            const correctedDate = new Date(
              dateObj.getFullYear(),
              dateObj.getMonth(),
              dateObj.getDate(),
              createdAt.getHours(),
              createdAt.getMinutes(),
              createdAt.getSeconds(),
            );

            finalDate = correctedDate.toISOString();
          }
        }
        let specificDetails: Record<string, any> = {};
        if (isAction && actionType && item.action_id) {
          const detailsData = await fetchActionDetails(actionType, item.action_id);
          switch (actionType) {
            case 'Alimentação':
              const feeding = detailsData as DbHiveFeeding;
              if (feeding.food_type) specificDetails['Alimento'] = feeding.food_type;
              break;
            case 'Colheita':
              const harvest = detailsData as DbHiveHarvest;
              if (harvest.qt_honey !== null && harvest.qt_honey !== undefined)
                specificDetails['Mel'] = formatWeightGrams(harvest.qt_honey);
              if (harvest.qt_pollen !== null && harvest.qt_pollen !== undefined)
                specificDetails['Pólen'] = formatWeightGrams(harvest.qt_pollen);
              if (harvest.qt_propolis !== null && harvest.qt_propolis !== undefined)
                specificDetails['Própolis'] = formatWeightGrams(harvest.qt_propolis);
              break;
            case 'Revisão':
              const inspection = detailsData as DbHiveInspection;
              if (inspection.queen_located !== null && inspection.queen_located !== undefined)
                specificDetails['Rainha Localizada'] = inspection.queen_located;
              if (inspection.queen_laying !== null && inspection.queen_laying !== undefined)
                specificDetails['Postura Observada'] = inspection.queen_laying;
              if (
                inspection.pests_or_diseases !== null &&
                inspection.pests_or_diseases !== undefined
              )
                specificDetails['Pragas/Doenças'] = inspection.pests_or_diseases;
              if (inspection.honey_reserve)
                specificDetails['Reserva de Mel'] = inspection.honey_reserve;
              if (inspection.pollen_reserve)
                specificDetails['Reserva de Pólen'] = inspection.pollen_reserve;
              break;
            case 'Manejo':
              const maintenance = detailsData as DbHiveMaintenance;
              if (maintenance.action) specificDetails['Ação Realizada'] = maintenance.action;
              break;
          }
        } else if (!isAction && transactionType) {
          const transactionItem = item as DbHiveTransaction;
          if (transactionItem.value !== null && transactionItem.value !== undefined)
            specificDetails['Valor'] = formatCurrency(transactionItem.value);
          if (transactionItem.donated_or_sold_to)
            specificDetails[transactionType === 'Venda' ? 'Vendido Para' : 'Doado Para'] =
              transactionItem.donated_or_sold_to;
          if (transactionItem.new_owner_contact)
            specificDetails['Contato'] = transactionItem.new_owner_contact;
          if (transactionItem.reason) specificDetails['Motivo (Perda)'] = transactionItem.reason;
        }
        return {
          id: String(item.id),
          type: isAction ? 'action' : 'transaction',
          date: finalDate,
          actionType,
          transactionType,
          details: specificDetails,
          observation: item.observation,
        };
      } catch (e) {
        console.error(`Erro ao processar item da timeline ID ${item.id}:`, e);
        return null;
      }
    }),
  );
  return processedItems
    .filter((item): item is HiveTimelineItem => item !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      const timeDiff = dateB.getTime() - dateA.getTime();
      if (timeDiff !== 0) return timeDiff;
      return b.id.localeCompare(a.id);
    });
};
