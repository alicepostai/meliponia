import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { HiveTimelineItem } from '@/types/DataTypes';
import HiveTimelineItemCard from '@/components/cards/hive-timeline-item-card';
import { useTheme } from '@/contexts/ThemeContext';
import { useHiveDetailTimelineStyles } from './styles';
interface EmptyStateProps {
  loading: boolean;
  error: string | null;
}
const EmptyState = memo(({ loading, error }: EmptyStateProps) => {
  const styles = useHiveDetailTimelineStyles();
  const { colors } = useTheme();
  if (loading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator color={colors.secondary} />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.errorText}>Erro ao carregar histórico: {error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.centeredMessageContainer}>
      <Text style={styles.emptyText}>
        Nenhum registro de manejo ou transação encontrado para esta colmeia.
      </Text>
    </View>
  );
});
interface HiveDetailTimelineProps {
  timeline: HiveTimelineItem[];
  loading: boolean;
  error: string | null;
  onDeleteAction: (item: HiveTimelineItem) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}
const HiveDetailTimeline = memo(
  ({
    timeline,
    loading,
    error,
    onDeleteAction,
    ListHeaderComponent,
    onRefresh,
    isRefreshing = false,
  }: HiveDetailTimelineProps) => {
    const styles = useHiveDetailTimelineStyles();
    const { colors } = useTheme();
    const renderItem = useCallback(
      ({ item }: { item: HiveTimelineItem }) => (
        <HiveTimelineItemCard item={item} onDelete={onDeleteAction} />
      ),
      [onDeleteAction],
    );
    const keyExtractor = useCallback((item: HiveTimelineItem) => item.id + item.date, []);
    return (
      <FlatList
        data={timeline}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={<EmptyState loading={loading} error={error} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.secondary}
              colors={[colors.secondary]}
            />
          ) : undefined
        }
      />
    );
  },
);

EmptyState.displayName = 'EmptyState';
HiveDetailTimeline.displayName = 'HiveDetailTimeline';

export default HiveDetailTimeline;
