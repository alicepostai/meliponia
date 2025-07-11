import { supabase, SupabaseQueryResult } from './supabase';
import {
  DbHiveAction,
  DbHiveFeeding,
  DbHiveHarvest,
  DbHiveInspection,
  DbHiveMaintenance,
  DbHiveTransaction,
  DbHiveCompleteActionView,
  PostgrestError,
  DbHive,
} from '@/types/supabase';
import { Alert } from 'react-native';
import { CreateHiveData, handleActionError, OfflineAction } from './types';
import { HiveDivisionFormValues } from '@/types/DataTypes';
import NetInfo from '@react-native-community/netinfo';
import { RealtimeChannel } from '@supabase/supabase-js';
import { serviceRegistry } from './ServiceRegistry';

const handleOffline = async (type: OfflineAction['type'], payload: any, forceOnline: boolean) => {
  const netState = await NetInfo.fetch();
  if (!forceOnline && (!netState.isConnected || !netState.isInternetReachable)) {
    const offlineAction = await serviceRegistry.getOfflineSyncService().queueAction(type, payload);
    return { success: true, pendingActionId: offlineAction.id };
  }
  return null;
};
const insertGenericAction = async (actionData: Omit<DbHiveAction, 'id' | 'created_at'>) => {
  const { error } = await supabase.from('hive_action').insert([actionData]);
  if (error) throw error;
};
const getAuthenticatedUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado.');
  return user;
};
type CreateFeedingData = Omit<DbHiveFeeding, 'id' | 'hive_id' | 'created_at' | 'dt_feeding'>;
type CreateHarvestData = Omit<
  DbHiveHarvest,
  'id' | 'user_id' | 'hive_id' | 'created_at' | 'dt_harvest'
>;
type CreateInspectionData = Omit<
  DbHiveInspection,
  'id' | 'user_id' | 'hive_id' | 'created_at' | 'dt_inspection'
>;
type CreateMaintenanceData = Omit<
  DbHiveMaintenance,
  'id' | 'hive_id' | 'created_at' | 'dt_maintenance'
>;
type CreateTransferData = { box_type: string; observation?: string | null };
type CreateOutgoingTransactionData = Omit<
  DbHiveTransaction,
  'id' | 'user_id' | 'hive_id' | 'created_at' | 'transaction_date' | 'transaction_type'
>;
export const actionService = {
  fetchActionHistory: async (): Promise<SupabaseQueryResult<DbHiveCompleteActionView[]>> => {
    try {
      const { data, error } = await supabase
        .from('hive_complete_actions_view')
        .select('*')
        .order('action_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const { error: handledError } = handleActionError(error, 'Buscar Histórico de Ações');
      return { data: null, error: handledError };
    }
  },
  fetchHiveTimeline: async (
    hiveId: string,
  ): Promise<{ data: (DbHiveAction | DbHiveTransaction)[]; error: PostgrestError | null }> => {
    try {
      const [actionsResult, transactionsResult] = await Promise.all([
        supabase.from('hive_action').select('*').eq('hive_id', hiveId),
        supabase.from('hive_transaction').select('*').eq('hive_id', hiveId),
      ]);
      if (actionsResult.error) throw actionsResult.error;
      if (transactionsResult.error) throw transactionsResult.error;
      const combined = [...(actionsResult.data || []), ...(transactionsResult.data || [])];
      combined.sort((a, b) => {
        const dateA = new Date(a.action_date || a.transaction_date || 0);
        const dateB = new Date(b.action_date || b.transaction_date || 0);
        const timeDiff = dateB.getTime() - dateA.getTime();
        if (timeDiff !== 0) return timeDiff;
        const createdA = new Date(a.created_at || 0);
        const createdB = new Date(b.created_at || 0);
        return createdB.getTime() - createdA.getTime();
      });
      return { data: combined, error: null };
    } catch (error) {
      const { error: handledError } = handleActionError(error, 'Buscar Timeline da Colmeia');
      return { data: [], error: handledError };
    }
  },
  createFeedingAction: async (
    hiveId: string,
    feedingData: CreateFeedingData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createFeedingAction',
      { hiveId, feedingData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const { data: feedingResult, error: feedingError } = await supabase
        .from('hive_feeding')
        .insert([{ ...feedingData, hive_id: hiveId, dt_feeding: actionDate.toISOString() }])
        .select()
        .single();
      if (feedingError) throw feedingError;
      await insertGenericAction({
        user_id: user.id,
        hive_id: hiveId,
        action_type: 'Alimentação',
        action_date: actionDate.toISOString(),
        action_id: feedingResult.id,
        observation: feedingData.observation,
      });
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Alimentação');
    }
  },
  createHarvestAction: async (
    hiveId: string,
    harvestData: CreateHarvestData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createHarvestAction',
      { hiveId, harvestData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const { data: harvestResult, error: harvestError } = await supabase
        .from('hive_harvest')
        .insert([
          {
            ...harvestData,
            user_id: user.id,
            hive_id: hiveId,
            dt_harvest: actionDate.toISOString(),
          },
        ])
        .select()
        .single();
      if (harvestError) throw harvestError;
      await insertGenericAction({
        user_id: user.id,
        hive_id: hiveId,
        action_type: 'Colheita',
        action_date: actionDate.toISOString(),
        action_id: harvestResult.id,
        observation: harvestData.observation,
      });
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Colheita');
    }
  },
  createInspectionAction: async (
    hiveId: string,
    inspectionData: CreateInspectionData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createInspectionAction',
      { hiveId, inspectionData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const { data: inspectionResult, error: inspectionError } = await supabase
        .from('hive_inspection')
        .insert([
          {
            ...inspectionData,
            user_id: user.id,
            hive_id: hiveId,
            dt_inspection: actionDate.toISOString(),
          },
        ])
        .select()
        .single();
      if (inspectionError) throw inspectionError;
      await insertGenericAction({
        user_id: user.id,
        hive_id: hiveId,
        action_type: 'Revisão',
        action_date: actionDate.toISOString(),
        action_id: inspectionResult.id,
        observation: inspectionData.observation,
      });
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Revisão');
    }
  },
  createMaintenanceAction: async (
    hiveId: string,
    maintenanceData: CreateMaintenanceData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createMaintenanceAction',
      { hiveId, maintenanceData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const { data: maintenanceResult, error: maintenanceError } = await supabase
        .from('hive_maintenance')
        .insert([{ ...maintenanceData, hive_id: hiveId, dt_maintenance: actionDate.toISOString() }])
        .select()
        .single();
      if (maintenanceError) throw maintenanceError;
      await insertGenericAction({
        user_id: user.id,
        hive_id: hiveId,
        action_type: 'Manejo',
        action_date: actionDate.toISOString(),
        action_id: maintenanceResult.id,
        observation: maintenanceData.observation,
      });
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Manejo');
    }
  },
  createTransferAction: async (
    hiveId: string,
    transferData: CreateTransferData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createTransferAction',
      { hiveId, transferData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const { error: hiveError } = await supabase
        .from('hive')
        .update({ box_type: transferData.box_type })
        .eq('id', hiveId);
      if (hiveError) throw hiveError;
      await insertGenericAction({
        user_id: user.id,
        hive_id: hiveId,
        action_type: 'Transferência',
        action_date: actionDate.toISOString(),
        action_id: null,
        observation: transferData.observation,
      });
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Transferência');
    }
  },
  createOutgoingTransaction: async (
    hiveId: string,
    outgoingType: 'Doação' | 'Venda' | 'Perda',
    transactionData: CreateOutgoingTransactionData,
    actionDate: Date,
    forceOnline = false,
  ): Promise<{ success: boolean; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createOutgoingTransaction',
      { hiveId, outgoingType, transactionData, actionDate: actionDate.toISOString() },
      forceOnline,
    );
    if (offlineResult) return offlineResult;
    try {
      const user = await getAuthenticatedUser();
      const hiveStatusMap: Record<typeof outgoingType, DbHive['status']> = {
        Doação: 'Doado',
        Venda: 'Vendido',
        Perda: 'Perdido',
      };
      const hiveStatus = hiveStatusMap[outgoingType];
      if (!hiveStatus) throw new Error('Tipo de saída inválido');
      await supabase.from('hive_transaction').insert([
        {
          ...transactionData,
          user_id: user.id,
          hive_id: hiveId,
          transaction_type: outgoingType,
          transaction_date: actionDate.toISOString(),
          value: outgoingType === 'Venda' ? transactionData.value : null,
        },
      ]);
      await supabase.from('hive').update({ status: hiveStatus }).eq('id', hiveId);
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Registrar Saída de Colmeia');
    }
  },
  deleteHiveAction: async (actionId: string): Promise<{ success: boolean }> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      await serviceRegistry.getOfflineSyncService().queueAction('deleteHiveAction', { actionId });
      Alert.alert(
        'Modo Offline',
        'Você está sem conexão. A exclusão foi salva e será processada assim que a internet voltar.',
      );
      return { success: true };
    }
    try {
      const confirmDelete = await new Promise<boolean>(resolve => {
        Alert.alert(
          'Excluir Registro',
          'Tem certeza que deseja excluir este registro de manejo/transação?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
          ],
          { cancelable: true, onDismiss: () => resolve(false) },
        );
      });
      if (!confirmDelete) return { success: false };
      const { error } = await supabase.from('hive_action').delete().eq('id', actionId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return handleActionError(error, 'Excluir Registro');
    }
  },
  createHiveFromDivision: async (
    divisionData: HiveDivisionFormValues,
    motherHives: DbHive[],
    forceOnline = false,
  ): Promise<{ success: boolean; newHiveId?: string | null; pendingActionId?: string }> => {
    const offlineResult = await handleOffline(
      'createHiveFromDivision',
      { divisionData, motherHives },
      forceOnline,
    );
    if (offlineResult) return { ...offlineResult, newHiveId: null };
    try {
      const { actionDate, newHiveCode, newHiveBoxType, observation } = divisionData;
      if (!actionDate || !newHiveCode || !newHiveBoxType || motherHives.length === 0)
        throw new Error('Dados incompletos para criar a divisão.');
      const user = await getAuthenticatedUser();
      const firstMotherHive = motherHives[0];
      const motherHiveCodes = motherHives
        .map(mh => mh.hive_code || `ID:${mh.id.substring(0, 4)}`)
        .join(', ');
      const newHivePayload: CreateHiveData = {
        bee_species_id: firstMotherHive.bee_species_id,
        bee_species_scientific_name: firstMotherHive.bee_species_scientific_name,
        origin_state_loc: firstMotherHive.origin_state_loc,
        box_type: newHiveBoxType.name,
        hive_origin: `Divisão de ${motherHiveCodes}`,
        acquisition_date: actionDate.toISOString(),
        hive_code: newHiveCode,
        description: observation || `Nova colmeia criada por divisão de ${motherHiveCodes}`,
        purchase_value: null,
      };
      const createResult = await serviceRegistry.getHiveService().createHive(newHivePayload, true);
      if (!createResult.data || createResult.error)
        throw createResult.error || new Error('Falha ao criar a nova colmeia da divisão.');
      const newHive = createResult.data;
      const divisionObservation = `Criada a partir da(s) colmeia(s): ${motherHiveCodes}.${
        observation ? ` Obs: ${observation}` : ''
      }`;
      const originObservation = `Cedeu divisão para nova colmeia: #${newHive.hive_code}.${
        observation ? ` Obs: ${observation}` : ''
      }`;
      await Promise.all([
        insertGenericAction({
          user_id: user.id,
          hive_id: newHive.id,
          action_type: 'Divisão de Enxame',
          action_date: actionDate.toISOString(),
          observation: divisionObservation,
          action_id: null,
        }),
        ...motherHives.map(motherHive =>
          insertGenericAction({
            user_id: user.id,
            hive_id: motherHive.id,
            action_type: 'Divisão Origem',
            action_date: actionDate.toISOString(),
            observation: originObservation,
            action_id: null,
          }),
        ),
      ]);
      if (!forceOnline)
        Alert.alert('Tudo Certo!', `Nova colmeia #${newHive.hive_code} criada por divisão!`);
      return { success: true, newHiveId: newHive.id };
    } catch (error) {
      const { success } = handleActionError(error, 'Registrar Divisão');
      return { success, newHiveId: null };
    }
  },
  subscribeToActionChanges: (hiveId: string, callback: (payload: any) => void): RealtimeChannel => {
    const channelName = `public:hive_action:hive_id=eq.${hiveId}`;
    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hive_action', filter: `hive_id=eq.${hiveId}` },
        payload => {
          console.log(`Real-time: Mudança em 'hive_action' para a colmeia ${hiveId}.`, payload);
          callback(payload);
        },
      )
      .subscribe(status => console.log(`Canal '${channelName}' status: ${status}`));
  },
  subscribeToTransactionChanges: (
    hiveId: string,
    callback: (payload: any) => void,
  ): RealtimeChannel => {
    const channelName = `public:hive_transaction:hive_id=eq.${hiveId}`;
    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hive_transaction', filter: `hive_id=eq.${hiveId}` },
        payload => {
          console.log(
            `Real-time: Mudança em 'hive_transaction' para a colmeia ${hiveId}.`,
            payload,
          );
          callback(payload);
        },
      )
      .subscribe(status => console.log(`Canal '${channelName}' status: ${status}`));
  },
};
