import React, { memo, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import HiveListItem from '@/components/hive/hive-list-item';
import FilterModal from '@/components/modals/filter-modal';
import SortModal, { SortOptionItem } from '@/components/modals/sort-modal';
import FabWithOptions from '@/components/menu/fab-with-options';
import { FeedbackState } from '@/components/ui/feedback-state';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/hooks/UseTutorial';
import { useHiveListScreenStyles } from './styles';
import { useHiveListScreen } from './UseHiveListScreen';
import { SortOption } from '@/hooks/UseHiveList';
import { ProcessedHiveListItem } from '@/types/DataTypes';
const hiveSortOptions: SortOptionItem<SortOption>[] = [
  { label: 'Data de Criação', value: 'creationDate' },
  { label: 'Nome da Espécie', value: 'speciesName' },
  { label: 'Código da Colmeia', value: 'hiveCode' },
];
const HiveListContent = memo(
  ({
    loading,
    error,
    hives,
    refreshHives,
    navigateToHiveDetails,
    navigateToHiveRegistration,
    searchText,
    filterStatus,
  }: ReturnType<typeof useHiveListScreen>) => {
    const styles = useHiveListScreenStyles();
    const { colors } = useTheme();
    const renderItem = useCallback(
      ({ item }: { item: ProcessedHiveListItem }) => (
        <HiveListItem item={item} onPress={() => navigateToHiveDetails(item.id)} />
      ),
      [navigateToHiveDetails],
    );
    const keyExtractor = useCallback((item: ProcessedHiveListItem) => item.id, []);
    if (loading && !hives.length) {
      return <FeedbackState type="loading" />;
    }
    if (error) {
      return (
        <FeedbackState
          type="error"
          title="Erro ao carregar colmeias"
          message={error}
          onRetry={refreshHives}
        />
      );
    }
    if (hives.length === 0) {
      const hasFilters = filterStatus !== 'Ativas' || !!searchText;
      return (
        <FeedbackState
          type="empty"
          title={hasFilters ? 'Nenhuma colmeia encontrada' : 'Você ainda não cadastrou colmeias'}
          icon="beehive-off-outline"
          onRetry={hasFilters ? undefined : navigateToHiveRegistration}
          retryButtonText="Cadastrar Primeira Colmeia"
        />
      );
    }
    return (
      <FlatList
        data={hives}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshHives}
            colors={[colors.honey]}
            tintColor={colors.honey}
          />
        }
      />
    );
  },
);

HiveListContent.displayName = 'HiveListContent';

const HiveListScreen = memo(() => {
  const styles = useHiveListScreenStyles();
  const { colors } = useTheme();
  const logic = useHiveListScreen();

  const tutorialSteps = [
    {
      id: '1',
      title: 'Bem-vindo às suas Colmeias!',
      description:
        'Aqui você pode ver todas as suas colmeias cadastradas. Vamos fazer um tour pelas principais funcionalidades desta tela.',
      position: 'center' as const,
    },
    {
      id: '2',
      title: 'Buscar Colmeias',
      description:
        'No topo da tela há uma barra de busca onde você pode procurar colmeias por código, espécie ou qualquer outro dado.',
      position: 'bottom' as const,
    },
    {
      id: '3',
      title: 'Filtros e Ordenação',
      description:
        'Ao lado da barra de busca existem botões para ordenar (crescente/decrescente) e filtrar suas colmeias por status.',
      position: 'bottom' as const,
    },
    {
      id: '4',
      title: 'Adicionar Nova Colmeia',
      description:
        'No canto inferior direito há um botão (+) onde você pode registrar uma nova colmeia ou fazer divisão de colmeias.',
      position: 'top' as const,
    },
  ];

  const tutorial = useTutorial({
    tutorialKey: 'hive-list',
    steps: tutorialSteps,
    autoStart: true,
    delay: 1000,
  });

  return (
    <ScreenWrapper noPadding>
      <View style={styles.container}>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons
              name="magnify"
              size={22}
              color={colors.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por Código, Espécie..."
              placeholderTextColor={colors.secondary}
              value={logic.searchText}
              onChangeText={logic.handleSearchChange}
              returnKeyType="search"
            />
            {logic.searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => logic.handleSearchChange('')}
                style={styles.clearButton}
              >
                <MaterialCommunityIcons name="close-circle" size={20} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={logic.openSortModal}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={logic.sortDirection === 'desc' ? 'sort-descending' : 'sort-ascending'}
                size={26}
                color={colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={logic.openFilterModal}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="filter-variant" size={26} color={colors.text} />
              {logic.filterStatus !== 'Ativas' && <View style={styles.filterBadge} />}
            </TouchableOpacity>
          </View>
        </View>
        <FilterModal
          isVisible={logic.isFilterModalVisible}
          onClose={logic.closeFilterModal}
          onSelectFilter={logic.handleFilterChange}
          selectedFilter={logic.filterStatus}
        />
        <SortModal
          isVisible={logic.isSortModalVisible}
          onClose={logic.closeSortModal}
          onSelectSort={logic.handleSortChange}
          currentSortOption={logic.sortOption}
          currentSortDirection={logic.sortDirection}
          options={hiveSortOptions}
        />
        <HiveListContent {...logic} />
      </View>
      {!logic.loading && !logic.error && (
        <FabWithOptions options={logic.fabOptions} fabIconName="plus" />
      )}

      <TutorialOverlay
        steps={tutorial.steps}
        visible={tutorial.isVisible}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
      />
    </ScreenWrapper>
  );
});

HiveListScreen.displayName = 'HiveListScreen';
export default HiveListScreen;
