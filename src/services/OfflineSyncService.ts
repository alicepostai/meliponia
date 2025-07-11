import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { syncOfflineUploads } from './StorageService';
import { EventEmitter } from 'events';
import { OfflineAction } from './types';
import { serviceRegistry } from './ServiceRegistry';

const OFFLINE_QUEUE_KEY = 'offline_action_queue';
let isSyncing = false;
const syncEmitter = new EventEmitter();
let netInfoUnsubscribe: (() => void) | null = null;
const getQueue = async (): Promise<OfflineAction[]> => {
  try {
    const queueJson = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('OfflineSyncService: Erro ao obter fila offline.', error);
    return [];
  }
};
const saveQueue = async (queue: OfflineAction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('OfflineSyncService: Erro ao salvar fila offline.', error);
  }
};
const executeAction = async (action: OfflineAction): Promise<boolean> => {
  console.log(`OfflineSyncService: Executando ação offline: ${action.type}`);
  try {
    const result = await serviceRegistry.executeOfflineAction(action);
    return !!(result.success !== false && (result.data || result.success));
  } catch (error) {
    console.error(`OfflineSyncService: Erro ao executar ação ${action.type}:`, error);
    return false;
  }
};
export const offlineSyncService = {
  queueAction: async (type: OfflineAction['type'], payload: any): Promise<OfflineAction> => {
    console.log(`OfflineSyncService: Enfileirando ação: ${type}`);
    const queue = await getQueue();
    const newAction: OfflineAction = {
      id: `offline_${Date.now()}_${Math.random()}`,
      type,
      payload,
      createdAt: Date.now(),
    };
    queue.push(newAction);
    await saveQueue(queue);
    Alert.alert(
      'Modo Offline',
      'Você está sem conexão. Sua ação foi salva e será enviada assim que a internet voltar.',
    );
    return newAction;
  },
  syncQueue: async (): Promise<void> => {
    if (isSyncing) return;
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) return;
    let queue = await getQueue();
    if (queue.length === 0) {
      await Promise.all([
        serviceRegistry.getProfileService().syncOfflineProfileUpdates(),
        syncOfflineUploads(),
      ]);
      return;
    }
    console.log(`OfflineSyncService: Iniciando sincronização de ${queue.length} ações.`);
    isSyncing = true;
    Alert.alert('Sincronizando...', `Enviando ${queue.length} ações pendentes.`);
    const remainingActions: OfflineAction[] = [];
    for (const action of queue) {
      const success = await executeAction(action);
      if (!success) {
        remainingActions.push(action);
      }
    }
    await saveQueue(remainingActions);
    await Promise.all([
      serviceRegistry.getProfileService().syncOfflineProfileUpdates(),
      syncOfflineUploads(),
    ]);
    isSyncing = false;
    if (remainingActions.length === 0) {
      console.log('OfflineSyncService: Fila sincronizada com sucesso!');
      Alert.alert('Sincronização Concluída', 'Todas as suas ações pendentes foram salvas.');
      syncEmitter.emit('syncComplete');
    } else {
      console.warn(`OfflineSyncService: ${remainingActions.length} ações falharam.`);
      Alert.alert(
        'Sincronização Parcial',
        `${remainingActions.length} ações não puderam ser enviadas.`,
      );
    }
  },
  initialize: (): void => {
    if (netInfoUnsubscribe) {
      console.log('OfflineSyncService: Já inicializado.');
      return;
    }
    console.log('OfflineSyncService: Inicializando listener de conexão.');
    offlineSyncService.syncQueue();
    netInfoUnsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        offlineSyncService.syncQueue();
      }
    });
  },
  unsubscribe: (): void => {
    if (netInfoUnsubscribe) {
      console.log('OfflineSyncService: Removendo listener de conexão.');
      netInfoUnsubscribe();
      netInfoUnsubscribe = null;
    }
  },
  onSyncComplete: (callback: () => void) => {
    syncEmitter.on('syncComplete', callback);
  },
  removeSyncCompleteListener: (callback: () => void) => {
    syncEmitter.removeListener('syncComplete', callback);
  },
  getPendingOfflineCount: async (): Promise<number> => {
    try {
      const [actionsQueue, profileUpdates, imageUploads] = await Promise.all([
        AsyncStorage.getItem(OFFLINE_QUEUE_KEY),
        AsyncStorage.getItem('offline_profile_updates'),
        AsyncStorage.getItem('offline_image_uploads'),
      ]);
      const actionsCount = actionsQueue ? JSON.parse(actionsQueue).length : 0;
      const profileCount = profileUpdates ? JSON.parse(profileUpdates).length : 0;
      const uploadsCount = imageUploads ? JSON.parse(imageUploads).length : 0;
      return actionsCount + profileCount + uploadsCount;
    } catch (error) {
      console.error('OfflineSyncService: Erro ao contar itens offline:', error);
      return 0;
    }
  },
};
export { OfflineAction };
