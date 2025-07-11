import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButton } from 'react-native-paper';
import { HiveTimelineItem } from '@/types/DataTypes';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import {
  formatDateWithWeekdayAndTime,
  getTimelineIconName,
  capitalizeFirstLetter,
} from '@/utils/helpers';
import { useHiveTimelineItemCardStyles, useDetailRowStyles } from './styles';

const DetailRow = memo(({ label, value }: { label: string; value: any }) => {
  const styles = useDetailRowStyles();
  if (value === null || value === undefined || value === '' || value === false) {
    return null;
  }
  const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
  return (
    <Text style={styles.detailText}>
      <Text style={styles.detailLabel}>{capitalizeFirstLetter(label)}: </Text>
      {displayValue}
    </Text>
  );
});
DetailRow.displayName = 'DetailRow';

const DetailsList = memo(({ details }: { details: { [key: string]: any } }) => (
  <>
    {Object.entries(details).map(([key, value]) => (
      <DetailRow key={key} label={key} value={value} />
    ))}
  </>
));
DetailsList.displayName = 'DetailsList';

interface HiveTimelineItemCardProps {
  item: HiveTimelineItem;
  onDelete: (item: HiveTimelineItem) => void;
}

const HiveTimelineItemCard = memo(({ item, onDelete }: HiveTimelineItemCardProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useHiveTimelineItemCardStyles();

  const handleDeletePress = useCallback(() => {
    if (item.type === 'action') {
      onDelete(item);
    } else {
      Alert.alert(
        'Ação Indisponível',
        'A exclusão de registros de Saída (Venda, Doação, Perda) não está habilitada diretamente na timeline.',
      );
    }
  }, [item, onDelete]);

  const formattedDate = useMemo(() => formatDateWithWeekdayAndTime(item.date), [item.date]);
  const iconName = getTimelineIconName(item.actionType || item.transactionType);
  const displayType = capitalizeFirstLetter(item.actionType || item.transactionType || 'Registro');

  return (
    <View style={styles.card}>
      <View style={styles.timelineLineContainer}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineLine} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          {item.type === 'action' && (
            <IconButton
              icon="delete-outline"
              size={20}
              iconColor={themeColors.error}
              onPress={handleDeletePress}
              style={styles.deleteButton}
              rippleColor="rgba(217, 83, 79, 0.2)"
            />
          )}
        </View>
        <View style={styles.body}>
          <MaterialCommunityIcons
            name={iconName}
            size={metrics.iconSizeLarge}
            color={themeColors.honey}
            style={styles.typeIcon}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.typeText}>{displayType}</Text>
            <DetailsList details={item.details} />
            {item.observation && (
              <Text style={styles.observationText} numberOfLines={3}>
                <Text style={styles.detailLabel}>Obs: </Text>
                {item.observation}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
});
HiveTimelineItemCard.displayName = 'HiveTimelineItemCard';

export default HiveTimelineItemCard;
