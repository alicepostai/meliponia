import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ProcessedHiveListItem } from '@/types/DataTypes';
import { useTheme } from '@/contexts/ThemeContext';
import { useHiveListItemStyles } from './styles';
import { metrics } from '@/theme/metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
interface HiveListItemProps {
  item: ProcessedHiveListItem;
  onPress: (id: string) => void;
}
const HiveListItem = memo(({ item, onPress }: HiveListItemProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useHiveListItemStyles();
  const statusIndicator = useMemo(
    () => ({
      Ativo: { icon: 'check-circle', color: themeColors.success },
      Vendido: { icon: 'currency-usd', color: themeColors.secondary },
      Doado: { icon: 'gift', color: themeColors.secondary },
      Perdido: { icon: 'alert-circle', color: themeColors.error },
    }),
    [themeColors],
  );
  const indicator = useMemo(() => {
    if (item.isPending) {
      return { icon: 'cloud-clock', color: themeColors.secondary };
    }
    return (
      statusIndicator[item.status as keyof typeof statusIndicator] || {
        icon: 'help-circle',
        color: themeColors.secondary,
      }
    );
  }, [item.isPending, item.status, statusIndicator, themeColors.secondary]);
  const handlePress = useCallback(() => {
    if (!item.isPending) {
      onPress(item.id);
    }
  }, [item.isPending, item.id, onPress]);
  return (
    <TouchableOpacity
      style={[styles.card, item.isPending && styles.pendingCard]}
      onPress={handlePress}
      activeOpacity={item.isPending ? 1 : 0.7}
      disabled={item.isPending}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Text style={styles.name} numberOfLines={1}>
            <Text style={styles.code}>#{item.hiveCode || 'N/C'}</Text> - {item.speciesName}
          </Text>
          <MaterialCommunityIcons
            name={indicator.icon}
            size={metrics.iconSizeMedium}
            color={indicator.color}
            style={styles.statusIcon}
          />
        </View>
        <Text style={styles.scientificName} numberOfLines={1}>
          {item.speciesScientificName}
        </Text>
        <Text style={styles.details} numberOfLines={1}>
          {item.origin} em {item.acquisitionDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
});
export default HiveListItem;
