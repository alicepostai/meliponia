import { supabase, SupabaseQueryResult, SupabaseSingleQueryResult } from './supabase';
import { DbHive, PostgrestError } from '@/types/supabase';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { RealtimeChannel } from '@supabase/supabase-js';
import { CreateHiveData, UpdateHiveData, HiveListFilter, handleServiceError } from './types';
import { serviceRegistry } from './ServiceRegistry';

export const hiveService = {
  fetchHiveById: async (hiveId: string): Promise<SupabaseSingleQueryResult<DbHive>> => {
    try {
      const { data, error } = await supabase.from('hive').select('*').eq('id', hiveId).single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleServiceError(error, 'Buscar Detalhes da Colmeia');
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
      const { error: handledError } = handleServiceError(error, 'Listar Colmeias');
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
      const { error: handledError } = handleServiceError(error, 'Buscar Colmeias Ativas');
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
      return handleServiceError(error, 'Cadastrar Colmeia');
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
      return handleServiceError(error, 'Atualizar Colmeia');
    }
  },
  deleteHiveCascade: async (
    hiveId: string,
  ): Promise<{ success: boolean; error: PostgrestError | null }> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      await serviceRegistry.getOfflineSyncService().queueAction('deleteHive', { hiveId });
      Alert.alert(
        'Modo Offline',
        'Você está sem conexão. A exclusão foi salva e será processada assim que a internet voltar.',
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
      const { error: handledError } = handleServiceError(error, 'Excluir Colmeia');
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
      console.error('Erro ao processar transferência:', error);
      return { success: false, message: error.message || 'Falha na transferência.' };
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
          console.log('Real-time: Mudança na tabela de colmeias detectada!', payload);
          callback(payload);
        },
      )
      .subscribe(status => {
        if (status === 'SUBSCRIBED')
          console.log(
            `Real-time: Inscrito com sucesso nas mudanças da tabela 'hive' para o usuário ${userId}.`,
          );
        else console.log(`Real-time: Novo status do canal de colmeias: ${status}`);
      });
    return channel;
  },
  unsubscribeChannel: async (channel: RealtimeChannel | null) => {
    if (channel) {
      try {
        await supabase.removeChannel(channel);
        console.log('Real-time: Canal removido com sucesso.');
      } catch (error) {
        console.error('Erro ao remover canal Supabase:', error);
      }
    }
  },
};
export { UpdateHiveData };
