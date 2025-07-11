import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { hiveService } from '@/services/HiveService';
import { DbHive } from '@/types/supabase';
import { ProcessedHiveListItem } from '@/types/DataTypes';
import { useAuth } from '@/contexts/AuthContext';
import { getBeeNameById, getBeeImageUrlById, formatDate } from '@/utils/helpers';
import { offlineSyncService } from '@/services/OfflineSyncService';
import { useFocusEffect } from 'expo-router';
export type HiveStatusFilter = 'Todas' | 'Ativas' | 'Vendidas' | 'Doadas' | 'Perdidas';
export type SortOption = 'creationDate' | 'speciesName' | 'hiveCode';
export type SortDirection = 'asc' | 'desc';
const processHiveDataForList = (hives: DbHive[] | null): ProcessedHiveListItem[] => {
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
export const useHiveList = () => {
  const { user } = useAuth();
  const [allHives, setAllHives] = useState<ProcessedHiveListItem[]>([]);
  const [pendingHives, setPendingHives] = useState<ProcessedHiveListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<HiveStatusFilter>('Ativas');
  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('creationDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const fetchData = useCallback(
    async (showLoadingIndicator = true) => {
      if (!user?.id) {
        setError('Usuário não autenticado.');
        setAllHives([]);
        if (showLoadingIndicator) setLoading(false);
        return;
      }
      if (showLoadingIndicator) setLoading(true);
      setError(null);
      const { data, error: fetchError } = await hiveService.fetchHivesByUserId(
        user.id,
        filterStatus,
      );
      if (fetchError) {
        setError(fetchError.message || 'Erro ao buscar colmeias.');
        setAllHives([]);
      } else {
        setAllHives(processHiveDataForList(data));
      }
      setLoading(false);
    },
    [user?.id, filterStatus],
  );
  useFocusEffect(
    useCallback(() => {
      fetchData(allHives.length === 0);
    }, [fetchData, allHives.length]),
  );
  const addPendingHive = useCallback((hive: DbHive) => {
    const [processed] = processHiveDataForList([hive]);
    if (processed) {
      setPendingHives(prev => [...prev, { ...processed, isPending: true }]);
    }
  }, []);
  const clearPendingItems = useCallback(() => {
    setPendingHives([]);
    fetchData(false);
  }, [fetchData]);
  useEffect(() => {
    offlineSyncService.onSyncComplete(clearPendingItems);
    return () => offlineSyncService.removeSyncCompleteListener(clearPendingItems);
  }, [clearPendingItems]);
  useEffect(() => {
    if (!user?.id) {
      if (channelRef.current) {
        hiveService.unsubscribeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }
    const handleDbChange = () => fetchData(false);
    if (!channelRef.current) {
      channelRef.current = hiveService.subscribeToHiveChanges(user.id, handleDbChange);
    }
    return () => {
      if (channelRef.current) {
        hiveService.unsubscribeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, fetchData]);
  const sortedAndFilteredHives = useMemo(() => {
    const dbHiveIds = new Set(allHives.map(h => h.id));
    const uniquePending = pendingHives.filter(p => !dbHiveIds.has(p.id));
    let hivesToProcess = [...uniquePending, ...allHives];
    const lowerSearchText = searchText.toLowerCase().trim();
    if (lowerSearchText) {
      hivesToProcess = hivesToProcess.filter(
        hive =>
          hive.speciesName?.toLowerCase().includes(lowerSearchText) ||
          hive.speciesScientificName?.toLowerCase().includes(lowerSearchText) ||
          hive.hiveCode?.toLowerCase().includes(lowerSearchText),
      );
    }
    return hivesToProcess
      .sort((a, b) => {
        let compareA: string | number, compareB: string | number;
        switch (sortOption) {
          case 'speciesName':
            compareA = a.speciesName.toLowerCase();
            compareB = b.speciesName.toLowerCase();
            break;
          case 'hiveCode':
            compareA = a.hiveCode?.toLowerCase() || '';
            compareB = b.hiveCode?.toLowerCase() || '';
            break;
          default:
            compareA = new Date(a.acquisitionDate).getTime();
            compareB = new Date(b.acquisitionDate).getTime();
            break;
        }
        if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
      .map(hive => ({ ...hive, acquisitionDate: formatDate(hive.acquisitionDate) }));
  }, [allHives, pendingHives, searchText, sortOption, sortDirection]);
  const handleSearchChange = useCallback((text: string) => setSearchText(text), []);
  const handleFilterChange = useCallback((newFilter: HiveStatusFilter) => {
    setFilterStatus(newFilter);
    setFilterModalVisible(false);
  }, []);
  const handleSortChange = useCallback((option: SortOption, direction: SortDirection) => {
    setSortOption(option);
    setSortDirection(direction);
  }, []);
  const openFilterModal = useCallback(() => setFilterModalVisible(true), []);
  const closeFilterModal = useCallback(() => setFilterModalVisible(false), []);
  const openSortModal = useCallback(() => setIsSortModalVisible(true), []);
  const closeSortModal = useCallback(() => setIsSortModalVisible(false), []);
  return {
    loading,
    error,
    hives: sortedAndFilteredHives,
    searchText,
    handleSearchChange,
    filterStatus,
    handleFilterChange,
    isFilterModalVisible,
    openFilterModal,
    closeFilterModal,
    refreshHives: fetchData,
    addPendingHive,
    sortOption,
    sortDirection,
    handleSortChange,
    isSortModalVisible,
    openSortModal,
    closeSortModal,
  };
};
