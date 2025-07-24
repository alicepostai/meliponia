import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProcessedActionHistoryItem } from '@/types/DataTypes';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import {
  formatDateWithWeekdayAndTime,
  getTimelineIconName,
  capitalizeFirstLetter,
  getBeeNameByScientificName,
} from '@/utils/helpers';
import { useActionHistoryCardStyles, useDetailFieldStyles } from './styles';
interface DetailFieldProps {
  label: string;
  value: any;
  unit?: string;
}
const DetailField = memo(({ label, value, unit }: DetailFieldProps) => {
  const styles = useDetailFieldStyles();
  if (value === null || value === undefined || value === '' || value === false) {
    return null;
  }
  const displayValue = typeof value === 'boolean' ? 'Sim' : value;
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>
        {displayValue}
        {unit ? ` ${unit}` : ''}
      </Text>
    </View>
  );
});
DetailField.displayName = 'DetailField';

type ActionDetailsProps = { action: ProcessedActionHistoryItem };

const HarvestDetails = memo(({ action }: ActionDetailsProps) => (
  <>
    <DetailField label="Mel" value={action.qtHoney} unit="g" />
    <DetailField label="Pólen" value={action.qtPollen} unit="g" />
    <DetailField label="Própolis" value={action.qtPropolis} unit="g" />
  </>
));
HarvestDetails.displayName = 'HarvestDetails';

const ReviewDetails = memo(({ action }: ActionDetailsProps) => (
  <>
    <DetailField label="Rainha Localizada" value={action.queenLocated} />
    <DetailField label="Postura Observada" value={action.queenLaying} />
    <DetailField label="Pragas/Doenças" value={action.pestsOrDiseases} />
  </>
));
ReviewDetails.displayName = 'ReviewDetails';

const FeedingDetails = memo(({ action }: ActionDetailsProps) => (
  <DetailField label="Alimento" value={action.foodType} />
));
FeedingDetails.displayName = 'FeedingDetails';

const MaintenanceDetails = memo(({ action }: ActionDetailsProps) => (
  <DetailField label="Ação Realizada" value={action.maintenanceAction} />
));
MaintenanceDetails.displayName = 'MaintenanceDetails';

const TransferDetails = memo(({ action }: ActionDetailsProps) => (
  <DetailField label="Transferido para a caixa" value={action.boxType} />
));
TransferDetails.displayName = 'TransferDetails';

const DivisionDetails = memo(({ action }: ActionDetailsProps) => (
  <DetailField label="Observações" value={action.observation} />
));
DivisionDetails.displayName = 'DivisionDetails';

const ActionDetailComponents: { [key: string]: React.FC<ActionDetailsProps> } = {
  Colheita: HarvestDetails,
  Revisão: ReviewDetails,
  Alimentação: FeedingDetails,
  Manejo: MaintenanceDetails,
  Transferência: TransferDetails,
  'Divisão de Colmeia': DivisionDetails,
  'Divisão Origem': DivisionDetails,
};

const ActionDetails = memo(({ action }: ActionDetailsProps) => {
  const DetailComponent = ActionDetailComponents[action.actionType];
  return DetailComponent ? <DetailComponent action={action} /> : null;
});
ActionDetails.displayName = 'ActionDetails';

interface ActionHistoryCardProps {
  action: ProcessedActionHistoryItem;
  onPress: (hiveId: string) => void;
}
const ActionHistoryCard = memo(({ action, onPress }: ActionHistoryCardProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useActionHistoryCardStyles();
  const handleCardPress = useCallback(() => {
    onPress(action.hiveId);
  }, [action.hiveId, onPress]);
  const iconName = getTimelineIconName(action.actionType);
  const actionTitleDisplay = capitalizeFirstLetter(action.actionType);
  const speciesDisplayName =
    getBeeNameByScientificName(action.beeSpeciesScientificName) || action.beeSpeciesScientificName;
  return (
    <TouchableOpacity style={styles.card} onPress={handleCardPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons
          name={iconName}
          size={metrics.iconSizeLarge + 4}
          color={themeColors.honey}
          style={styles.actionIcon}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.actionTitle} numberOfLines={1}>
            {actionTitleDisplay}
          </Text>
          <Text style={styles.actionDate}>{formatDateWithWeekdayAndTime(action.date)}</Text>
        </View>
      </View>
      <View style={styles.hiveInfoContainer}>
        <Text style={styles.hiveInfoText}>
          Colmeia: <Text style={styles.hiveCodeText}>#{action.hiveCode || 'N/C'}</Text>
        </Text>
        <Text style={[styles.hiveInfoText, styles.speciesText]}>Espécie: {speciesDisplayName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <ActionDetails action={action} />
      </View>
    </TouchableOpacity>
  );
});
ActionHistoryCard.displayName = 'ActionHistoryCard';

export default ActionHistoryCard;
