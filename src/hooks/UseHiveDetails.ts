import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { hiveService } from '@/services/HiveService';
import { actionService } from '@/services/ActionService';
import { HiveDetails, HiveTimelineItem } from '@/types/DataTypes';
import { processHiveDetails, processTimelineData } from '@/utils/data-processors';
import { useAuth } from '@/contexts/AuthContext';
import { Alert } from 'react-native';
export const useHiveDetails = (hiveId: string | undefined) => {
  const { user } = useAuth();
  const [hive, setHive] = useState<HiveDetails | null>(null);
  const [timeline, setTimeline] = useState<HiveTimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const fetchData = useCallback(
    async (showInitialLoading = true) => {
      if (!hiveId) {
        setError('ID da colmeia não fornecido.');
        setLoading(false);
        return;
      }
      if (showInitialLoading) setLoading(true);
      setError(null);
      try {
        const [hiveResult, timelineResult] = await Promise.all([
          hiveService.fetchHiveById(hiveId),
          actionService.fetchHiveTimeline(hiveId),
        ]);
        if (hiveResult.error)
          throw new Error(hiveResult.error.message || 'Erro ao buscar dados da colmeia.');
        if (timelineResult.error)
          throw new Error(timelineResult.error.message || 'Erro ao buscar histórico.');
        setHive(processHiveDetails(hiveResult.data));
        setTimeline(await processTimelineData(timelineResult.data));
      } catch (e: any) {
        console.error('useHiveDetails -> fetchData: Exceção geral', e);
        setError(e.message || 'Ocorreu um erro inesperado.');
        setHive(null);
        setTimeline([]);
      } finally {
        if (showInitialLoading) setLoading(false);
      }
    },
    [hiveId],
  );
  useEffect(() => {
    if (hiveId) {
      fetchData(true);
    }
  }, [hiveId, fetchData]);
  useFocusEffect(
    useCallback(() => {
      if (hiveId && !loading) {
        fetchData(false);
      }
    }, [hiveId, loading, fetchData]),
  );
  useEffect(() => {
    if (!hiveId || !user?.id) return;
    const handleDbChange = (sourceTable: string) => {
      console.log(`useHiveDetails -> Realtime: Mudança detectada na tabela ${sourceTable}`);
      fetchData(false);
    };
    const newHiveChannel = hiveService.subscribeToHiveChanges(user.id, () =>
      handleDbChange('hive'),
    );
    const newActionChannel = actionService.subscribeToActionChanges(hiveId, () =>
      handleDbChange('hive_action'),
    );
    const newTransactionChannel = actionService.subscribeToTransactionChanges(hiveId, () =>
      handleDbChange('hive_transaction'),
    );
    channelsRef.current = [newHiveChannel, newActionChannel, newTransactionChannel].filter(
      Boolean,
    ) as RealtimeChannel[];
    return () => {
      console.log('useHiveDetails -> Limpando subscrições...');
      channelsRef.current.forEach(channel => hiveService.unsubscribeChannel(channel));
      channelsRef.current = [];
    };
  }, [hiveId, user?.id, fetchData]);
  const deleteTimelineItem = useCallback(
    async (item: HiveTimelineItem) => {
      if (item.type === 'action' && item.actionType) {
        const result = await actionService.deleteHiveAction(item.id);
        if (result.success) {
          fetchData(false);
        }
      } else {
        Alert.alert('Não Implementado', 'Exclusão de transações não implementada.');
      }
    },
    [fetchData],
  );
  return {
    hive,
    timeline,
    loading,
    error,
    deleteTimelineItem,
    refreshData: fetchData,
  };
};
