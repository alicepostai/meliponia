import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import {
  useActionHistory,
  ActionSortOption,
  ActionSortDirection,
  ActionTypeFilter,
} from '@/hooks/UseActionHistory';
import ActionHistoryCard from '@/components/cards/action-history-card';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import { useTheme } from '@/contexts/ThemeContext';
import { useActionHistoryScreenStyles, useFeedbackStateStyles } from './styles';
import ActionFilterModal from '@/components/modals/action-filter-modal';
import SortModal, { SortOptionItem } from '@/components/modals/sort-modal';
import { ProcessedActionHistoryItem } from '@/types/DataTypes';
const actionSortOptions: SortOptionItem<ActionSortOption>[] = [
  { label: 'Data da Ação', value: 'date' },
  { label: 'Tipo de Ação', value: 'actionType' },
  { label: 'Nome da Espécie', value: 'speciesName' },
];
const FeedbackState = memo(
  ({
    loading,
    error,
    onRetry,
    hasFilters,
    hasSearch,
  }: {
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    hasFilters: boolean;
    hasSearch: boolean;
  }) => {
    const styles = useFeedbackStateStyles();
    const { colors } = useTheme();
    if (loading) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={colors.honey} />
          <Text style={[styles.feedbackMessage, { marginTop: 12 }]}>
            Carregando seu histórico...
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.feedbackContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={60}
            color={colors.error}
            style={styles.feedbackIcon}
          />
          <Text style={[styles.feedbackTitle, styles.errorText]}>Ops! Algo deu errado</Text>
          <Text style={[styles.feedbackMessage, styles.errorText]}>{error}</Text>
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.feedbackContainer}>
        <MaterialCommunityIcons
          name="history"
          size={60}
          color={colors.secondary}
          style={styles.feedbackIcon}
        />
        <Text style={styles.feedbackTitle}>
          {hasFilters || hasSearch ? 'Nenhuma Ação Encontrada' : 'Histórico Vazio'}
        </Text>
        <Text style={styles.feedbackMessage}>
          {hasFilters || hasSearch
            ? 'Tente refinar sua busca ou verifique os filtros aplicados.'
            : 'Quando você registrar ações, elas aparecerão aqui.'}
        </Text>
      </View>
    );
  },
);
const ActionList = memo(
  ({
    actions,
    loading,
    onRefresh,
    navigateToHive,
  }: {
    actions: ProcessedActionHistoryItem[];
    loading: boolean;
    onRefresh: () => void;
    navigateToHive: (id: string) => void;
  }) => {
    const styles = useActionHistoryScreenStyles();
    const { colors } = useTheme();
    const renderItem = useCallback(
      ({ item }: { item: ProcessedActionHistoryItem }) => (
        <ActionHistoryCard action={item} onPress={() => navigateToHive(item.hiveId)} />
      ),
      [navigateToHive],
    );
    const keyExtractor = useCallback((item: ProcessedActionHistoryItem) => item.id, []);
    return (
      <FlatList
        data={actions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[colors.honey]}
            tintColor={colors.honey}
          />
        }
      />
    );
  },
);
const ActionHistoryScreen = memo(() => {
  const styles = useActionHistoryScreenStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const {
    loading,
    error,
    actions,
    searchText,
    handleSearchChange,
    refreshActions,
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
  } = useActionHistory();
  const navigateToHive = useCallback(
    (hiveId: string) => {
      if (hiveId && hiveId !== 'N/A') router.push(`/hive/${hiveId}`);
    },
    [router],
  );
  const showFeedback = loading || error || actions.length === 0;
  return (
    <ScreenWrapper noPadding>
      <View style={styles.container}>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={colors.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor={colors.secondary}
              value={searchText}
              onChangeText={handleSearchChange}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearchChange('')}
                style={styles.clearSearchButton}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={openSortModal} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name={sortDirection === 'desc' ? 'sort-descending' : 'sort-ascending'}
              size={26}
              color={colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={openFilterModal}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="filter-variant" size={26} color={colors.text} />
            {activeFilters.length > 0 && <View style={styles.filterBadge} />}
          </TouchableOpacity>
        </View>
        <ActionFilterModal
          isVisible={isFilterModalVisible}
          onClose={closeFilterModal}
          onApplyFilters={handleApplyFilters}
          currentFilters={activeFilters}
        />
        <SortModal<ActionSortOption>
          isVisible={isSortModalVisible}
          onClose={closeSortModal}
          onSelectSort={handleSortChange}
          currentSortOption={sortOption}
          currentSortDirection={sortDirection}
          options={actionSortOptions}
        />
        {showFeedback ? (
          <FeedbackState
            loading={loading && actions.length === 0}
            error={error}
            onRetry={refreshActions}
            hasFilters={activeFilters.length > 0}
            hasSearch={searchText.length > 0}
          />
        ) : (
          <ActionList
            actions={actions}
            loading={loading}
            onRefresh={refreshActions}
            navigateToHive={navigateToHive}
          />
        )}
      </View>
    </ScreenWrapper>
  );
});
export default ActionHistoryScreen;
