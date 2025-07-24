import { supabase, SupabaseSingleQueryResult } from './supabase';
import { DbProfile, PostgrestError } from '@/types/supabase';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';
import { AlertService } from './AlertService';
const handleProfileError = (
  error: unknown,
  context: string,
): { data: null; error: PostgrestError } => {
  const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
  logger.error(`Error during ProfileService ${context}:`, error);
  AlertService.showError(errorMessage, {
    title: `Erro de Perfil - ${context}`
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
export const profileService = {
  getProfile: async (userId: string): Promise<SupabaseSingleQueryResult<DbProfile>> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code === 'PGRST116') {
        logger.info(`Perfil para usuário ${userId} não encontrado, criando um novo.`);
        const { data: newProfile, error: creationError } = await supabase
          .from('profiles')
          .insert({ id: userId, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (creationError) throw creationError;
        return { data: newProfile, error: null };
      }
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleProfileError(error, 'Buscar Perfil');
    }
  },
  updateProfile: async (
    userId: string,
    profileData: {
      full_name?: string | null;
      avatar_url?: string | null;
    },
  ): Promise<SupabaseSingleQueryResult<DbProfile>> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      try {
        const offlineKey = 'offline_profile_updates';
        const existingUpdates = await AsyncStorage.getItem(offlineKey);
        const updates = existingUpdates ? JSON.parse(existingUpdates) : [];
        updates.push({
          id: `offline_${Date.now()}_${Math.random()}`,
          userId,
          profileData,
          createdAt: Date.now(),
        });
        await AsyncStorage.setItem(offlineKey, JSON.stringify(updates));
        AlertService.showError(
          'Você está sem conexão. Suas alterações foram salvas e serão enviadas assim que a internet voltar.',
          {
            title: 'Modo Offline'
          }
        );
      } catch (storageError) {
        logger.error('Erro ao salvar perfil offline:', storageError);
      }
      return {
        data: null,
        error: {
          message: 'Perfil salvo offline - será sincronizado quando houver conexão',
          details: '',
          hint: '',
          code: 'OFFLINE',
          name: 'OfflineError',
        },
      };
    }
    try {
      const updates = {
        ...profileData,
        id: userId,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from('profiles').upsert(updates).select().single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return handleProfileError(error, 'Atualizar Perfil');
    }
  },
  syncOfflineProfileUpdates: async (): Promise<void> => {
    try {
      const offlineKey = 'offline_profile_updates';
      const existingUpdates = await AsyncStorage.getItem(offlineKey);
      if (!existingUpdates) return;
      const updates = JSON.parse(existingUpdates);
      if (updates.length === 0) return;
      logger.info(
        `ProfileService: Sincronizando ${updates.length} atualizações de perfil offline.`,
      );
      const remainingUpdates = [];
      for (const update of updates) {
        try {
          const profileUpdates = {
            ...update.profileData,
            id: update.userId,
            updated_at: new Date().toISOString(),
          };
          const { error } = await supabase.from('profiles').upsert(profileUpdates);
          if (error) {
            logger.error('Erro ao sincronizar perfil:', error);
            remainingUpdates.push(update);
          }
        } catch (error) {
          logger.error('Erro ao processar atualização de perfil offline:', error);
          remainingUpdates.push(update);
        }
      }
      await AsyncStorage.setItem(offlineKey, JSON.stringify(remainingUpdates));
      if (remainingUpdates.length === 0) {
        logger.info('ProfileService: Todas as atualizações de perfil foram sincronizadas.');
      } else {
        logger.warn(`ProfileService: ${remainingUpdates.length} atualizações de perfil falharam.`);
      }
    } catch (error) {
      logger.error('ProfileService: Erro ao sincronizar perfis offline:', error);
    }
  },

  deleteAccount: async (userId: string): Promise<{ success: boolean; error: string | null }> => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      AlertService.showNetworkError();
      return { success: false, error: 'Sem conexão com a internet' };
    }

    try {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);

      if (deleteUserError) {
        if (
          deleteUserError.message.includes('admin') ||
          deleteUserError.message.includes('forbidden')
        ) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: '[CONTA EXCLUÍDA]',
              avatar_url: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (profileError) throw profileError;

          return { success: true, error: null };
        } else {
          throw deleteUserError;
        }
      }

      return { success: true, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido ao excluir conta.';
      logger.error('Erro ao excluir conta:', error);
      return { success: false, error: errorMessage };
    }
  },
};
