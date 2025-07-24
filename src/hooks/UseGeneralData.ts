import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { generalDataService } from '@/services/GeneralDataService';
import { hiveService } from '@/services/HiveService';
import { AggregatedData } from '@/types/DataTypes';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';
export const useGeneralData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AggregatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const fetchData = useCallback(
    async (showLoadingIndicator = true) => {
      if (!user?.id) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
      if (showLoadingIndicator) setLoading(true);
      setError(null);
      const { data: aggregatedData, error: fetchError } =
        await generalDataService.fetchAggregatedData(user.id);
      if (fetchError) {
        setData(null);
        setError(fetchError.message || 'Falha ao buscar dados gerais.');
      } else {
        setData(aggregatedData);
      }
      if (showLoadingIndicator) setLoading(false);
    },
    [user?.id],
  );
  useFocusEffect(
    useCallback(() => {
      fetchData(data === null);
    }, [fetchData, data]),
  );
  useEffect(() => {
    if (!user?.id) return;
    
    const handleDbChange = () => {
      fetchData(false);
    };
    
    const tablesToSubscribe: string[] = ['hive', 'hive_harvest', 'hive_transaction', 'hive_action'];
    channelsRef.current.forEach(channel => hiveService.unsubscribeChannel(channel));
    
    channelsRef.current = tablesToSubscribe.map(table => {
      const channelName = `public:${table}:user_id=eq.${user.id}`;
      return supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table, filter: `user_id=eq.${user.id}` },
          handleDbChange,
        )
        .subscribe();
    });
    
    return () => {
      channelsRef.current.forEach(channel => hiveService.unsubscribeChannel(channel));
      channelsRef.current = [];
    };
  }, [user?.id, fetchData]);
  return {
    data,
    loading,
    error,
    refreshData: () => fetchData(true),
  };
};
