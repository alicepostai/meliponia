import { supabase, SupabaseQueryResult, SupabaseSingleQueryResult } from './supabase';
import { DbHive, PostgrestError } from '@/types/supabase';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CreateHiveData, UpdateHiveData, HiveListFilter, handleServiceError } from './types';
import { serviceRegistry } from './ServiceRegistry';
import { logger } from '@/utils/logger';
import { AlertService } from './AlertService';

export const hiveService = {
  fetchHiveById: async (hiveId: string): Promise<SupabaseSingleQueryResult<DbHive>> => {
    try {
      const { data, error } = await supabase.from('hive').select('*').eq('id', hiveId).single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleServiceError(error, 'HiveService.fetchHiveById: Failed to fetch hive details');
    }
  },
  fetchHivesByUserId: async (
    userId: string,
    filter: HiveListFilter = 'Ativas',
  ): Promise<SupabaseQueryResult<DbHive[]>> => {
    try {
      let query = supabase
        .from('hive')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (filter !== 'Todas') {
        const statusMap: Record<Exclude<HiveListFilter, 'Todas'>, DbHive['status']> = {
          Ativas: 'Ativo',
          Vendidas: 'Vendido',
          Doadas: 'Doado',
          Perdidas: 'Perdido',
        };
        if (filter in statusMap) {
          query = query.eq('status', statusMap[filter as keyof typeof statusMap]);
        }
      }
      const { data, error } = await query;
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const { error: handledError } = handleServiceError(error, 'HiveService.fetchHivesByUserId: Failed to list hives');
      return { data: null, error: handledError };
    }
  },
  fetchActiveHivesForSelection: async (
    userId: string,
    speciesId?: number | null,
    excludeHiveId?: string | null,
  ): Promise<SupabaseQueryResult<DbHive[]>> => {
    try {
      let query = supabase.from('hive').select('*').eq('user_id', userId).eq('status', 'Ativo');
      if (speciesId) query = query.eq('bee_species_id', speciesId);
      if (excludeHiveId) query = query.not('id', 'eq', excludeHiveId);
      const { data, error } = await query.order('hive_code', { ascending: true });
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      const { error: handledError } = handleServiceError(error, 'HiveService.fetchActiveHivesForSelection: Failed to fetch active hives');
      return { data: null, error: handledError };
    }
  },
  createHive: async (
    hiveData: CreateHiveData,
    forceOnline = false,
  ): Promise<SupabaseSingleQueryResult<DbHive>> => {
    const netState = await NetInfo.fetch();
    if (!forceOnline && (!netState.isConnected || !netState.isInternetReachable)) {
      const offlineAction = await serviceRegistry
        .getOfflineSyncService()
        .queueAction('createHive', { hiveData });
      const pendingHive: DbHive = {
        ...hiveData,
        id: offlineAction.id,
        user_id: '',
        created_at: new Date().toISOString(),
        status: 'Ativo',
        latitude: hiveData.latitude ?? null,
        longitude: hiveData.longitude ?? null,
        description: hiveData.description ?? null,
        purchase_value: hiveData.purchase_value ?? null,
        image_url: hiveData.image_url ?? null,
      };
      return { data: pendingHive, error: null };
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');
      const dataToInsert = { ...hiveData, user_id: user.id, status: 'Ativo' as const };
      const { data, error } = await supabase.from('hive').insert([dataToInsert]).select().single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleServiceError(error, 'HiveService.createHive: Failed to create hive');
    }
  },
  updateHive: async (
    hiveId: string,
    hiveData: UpdateHiveData,
  ): Promise<SupabaseSingleQueryResult<DbHive>> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      await serviceRegistry.getOfflineSyncService().queueAction('updateHive', { hiveId, hiveData });
      return {
        data: null,
        error: {
          message: 'Operação salva offline - será sincronizada quando houver conexão',
          details: '',
          hint: '',
          code: 'OFFLINE',
          name: 'OfflineError',
        },
      };
    }
    try {
      const { data, error } = await supabase
        .from('hive')
        .update(hiveData)
        .eq('id', hiveId)
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleServiceError(error, 'HiveService.updateHive: Failed to update hive');
    }
  },
  deleteHiveCascade: async (
    hiveId: string,
  ): Promise<{ success: boolean; error: PostgrestError | null }> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      await serviceRegistry.getOfflineSyncService().queueAction('deleteHive', { hiveId });
      AlertService.showError(
        'Você está sem conexão. A exclusão foi salva e será processada assim que a internet voltar.',
        {
          title: 'Modo Offline'
        }
      );
      return { success: true, error: null };
    }
    try {
      const confirmDelete = await new Promise<boolean>(resolve => {
        Alert.alert(
          'Excluir Colmeia',
          'Tem certeza que deseja excluir esta colmeia e TODOS os seus registros associados? Esta ação não pode ser desfeita.',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
          ],
          { cancelable: true, onDismiss: () => resolve(false) },
        );
      });
      if (!confirmDelete) return { success: false, error: null };

      await supabase.from('hive_feeding').delete().eq('hive_id', hiveId);
      await supabase.from('hive_harvest').delete().eq('hive_id', hiveId);
      await supabase.from('hive_inspection').delete().eq('hive_id', hiveId);
      await supabase.from('hive_maintenance').delete().eq('hive_id', hiveId);
      await supabase.from('hive_transaction').delete().eq('hive_id', hiveId);
      await supabase.from('hive_transfer_tokens').delete().eq('hive_id', hiveId);
      await supabase.from('hive_action').delete().eq('hive_id', hiveId);

      const { error } = await supabase.from('hive').delete().eq('id', hiveId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      const { error: handledError } = handleServiceError(error, 'HiveService.deleteHiveCascade: Failed to delete hive and related records');
      return { success: false, error: handledError };
    }
  },
  processHiveTransfer: async (
    hiveId: string,
    sourceUserId: string,
    outgoingType: 'Venda' | 'Doação',
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const newStatus = outgoingType === 'Venda' ? 'Vendido' : 'Doado';
      const { error } = await supabase
        .from('hive')
        .update({ status: newStatus })
        .eq('id', hiveId)
        .eq('user_id', sourceUserId);

      if (error) throw new Error(error.message);
      return { success: true, message: 'Colmeia transferida com sucesso!' };
    } catch (error: any) {
      logger.error('HiveService.processHiveTransfer: Transfer processing failed:', error);
      return { success: false, message: error.message || 'HiveService.processHiveTransfer: Transfer failed' };
    }
  },
  subscribeToHiveChanges: (
    userId: string | undefined,
    callback: (payload: any) => void,
  ): RealtimeChannel | null => {
    if (!userId) return null;
    const channel = supabase
      .channel(`public:hive:user_id=eq.${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hive', filter: `user_id=eq.${userId}` },
        payload => {
          callback(payload);
        },
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED')
          logger.info(`HiveService.subscribeToHiveChanges: Successfully subscribed to hive changes for user ${userId}`);
      });
    return channel;
  },
  unsubscribeChannel: async (channel: RealtimeChannel | null) => {
    if (channel) {
      try {
        await supabase.removeChannel(channel);
        logger.info('HiveService.unsubscribeChannel: Channel removed successfully');
      } catch (error) {
        logger.error('HiveService.unsubscribeChannel: Failed to remove channel:', error);
      }
    }
  },
};
export { UpdateHiveData };
