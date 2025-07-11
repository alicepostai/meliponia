import { useState, useCallback, useMemo } from 'react';
import { actionService } from '@/services/ActionService';
import { ProcessedActionHistoryItem } from '@/types/DataTypes';
import { DbHiveCompleteActionView } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect } from 'expo-router';
export type ActionTypeFilter =
  | 'Revisão'
  | 'Alimentação'
  | 'Colheita'
  | 'Manejo'
  | 'Transferência de Caixa'
  | 'Divisão de Enxame'
  | 'Divisão Origem';
export type ActionSortOption = 'date' | 'actionType' | 'speciesName';
export type ActionSortDirection = 'asc' | 'desc';
const processActionHistory = (
  actions: DbHiveCompleteActionView[] | null,
): ProcessedActionHistoryItem[] => {
  if (!actions) return [];
  const processed = actions.map(action => {
    let finalDate = action.action_date;

    if (finalDate) {
      const dateObj = new Date(finalDate);
      const localHours = dateObj.getHours();
      const localMinutes = dateObj.getMinutes();

      if (localHours === 0 && localMinutes === 0) {
        const createdAt = new Date(action.created_at);

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

    return {
      id: action.id_hive_action,
      actionId: action.id_hive_action,
      actionType: action.action_type,
      date: finalDate,
      hiveId: action.hive_id,
      hiveCode: action.hive_code,
      beeSpeciesScientificName: action.bee_species_scientific_name || 'N/A',
      foodType: action.food_type,
      qtHoney: action.qt_honey,
      qtPollen: action.qt_pollen,
      qtPropolis: action.qt_propolis,
      queenLocated: action.queen_located,
      queenLaying: action.queen_laying,
      pestsOrDiseases: action.pests_or_diseases,
      maintenanceAction: action.maintenance_action,
      boxType: action.box_type,
      observation: action.observation_general,
    };
  });

  return processed.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    const timeDiff = dateB - dateA;
    if (timeDiff !== 0) return timeDiff;
    return b.id.localeCompare(a.id);
  });
};
export const useActionHistory = () => {
  const { user } = useAuth();
  const [allActions, setAllActions] = useState<ProcessedActionHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<ActionTypeFilter[]>([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<ActionSortOption>('date');
  const [sortDirection, setSortDirection] = useState<ActionSortDirection>('desc');
  const [isSortModalVisible, setIsSortModalVisible] = useState<boolean>(false);
  const fetchData = useCallback(
    async (showLoadingIndicator = true) => {
      if (!user) {
        setError('Usuário não autenticado.');
        setAllActions([]);
        if (showLoadingIndicator) setLoading(false);
        return;
      }
      if (showLoadingIndicator) setLoading(true);
      setError(null);
      const { data, error: fetchError } = await actionService.fetchActionHistory();
      if (fetchError) {
        setError(fetchError.message || 'Erro ao buscar histórico de ações.');
        setAllActions([]);
      } else {
        setAllActions(processActionHistory(data));
      }
      setLoading(false);
    },
    [user],
  );
  useFocusEffect(
    useCallback(() => {
      fetchData(allActions.length === 0);
    }, [fetchData, allActions.length]),
  );
  const filteredAndSortedActions = useMemo(() => {
    let actionsToProcess = [...allActions];
    if (activeFilters.length > 0) {
      actionsToProcess = actionsToProcess.filter(action =>
        activeFilters.includes(action.actionType as ActionTypeFilter),
      );
    }
    const lowerSearchText = searchText.toLowerCase().trim();
    if (lowerSearchText) {
      actionsToProcess = actionsToProcess.filter(
        action =>
          action.hiveCode?.toLowerCase().includes(lowerSearchText) ||
          action.beeSpeciesScientificName?.toLowerCase().includes(lowerSearchText) ||
          action.actionType?.toLowerCase().includes(lowerSearchText),
      );
    }
    actionsToProcess.sort((a, b) => {
      let compareA: any;
      let compareB: any;
      switch (sortOption) {
        case 'actionType':
          compareA = a.actionType || '';
          compareB = b.actionType || '';
          break;
        case 'speciesName':
          compareA = a.beeSpeciesScientificName || '';
          compareB = b.beeSpeciesScientificName || '';
          break;
        case 'date':
        default:
          compareA = new Date(a.date).getTime();
          compareB = new Date(b.date).getTime();
          break;
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;

      if (sortOption === 'date') {
        return sortDirection === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }

      return 0;
    });
    return actionsToProcess;
  }, [allActions, searchText, activeFilters, sortOption, sortDirection]);
  const handleSearchChange = useCallback((text: string) => setSearchText(text), []);
  const handleApplyFilters = useCallback(
    (filters: ActionTypeFilter[]) => setActiveFilters(filters),
    [],
  );
  const handleSortChange = useCallback(
    (option: ActionSortOption, direction: ActionSortDirection) => {
      setSortOption(option);
      setSortDirection(direction);
    },
    [],
  );
  const openFilterModal = useCallback(() => setFilterModalVisible(true), []);
  const closeFilterModal = useCallback(() => setFilterModalVisible(false), []);
  const openSortModal = useCallback(() => setIsSortModalVisible(true), []);
  const closeSortModal = useCallback(() => setIsSortModalVisible(false), []);
  return {
    loading,
    error,
    actions: filteredAndSortedActions,
    searchText,
    handleSearchChange,
    activeFilters,
    handleApplyFilters,
    isFilterModalVisible,
    openFilterModal,
    closeFilterModal,
    sortOption,
    sortDirection,
    handleSortChange,
    isSortModalVisible,
    openSortModal,
    closeSortModal,
    refreshActions: () => fetchData(true),
  };
};
