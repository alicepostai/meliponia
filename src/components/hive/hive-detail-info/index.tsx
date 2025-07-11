import React, { memo, useMemo } from 'react';
import { View, Text } from 'react-native';
import { HiveDetails } from '@/types/DataTypes';
import { formatDate } from '@/utils/helpers';
import { useHiveDetailInfoStyles, useHiveDetailInfoSkeletonStyles } from './styles';
interface HiveDetailInfoProps {
  hive: HiveDetails | null;
}
const InfoRow = memo(
  ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    const styles = useHiveDetailInfoStyles();
    if (value === null || value === undefined || value === '') return null;
    return (
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}: </Text>
        <Text style={styles.infoValue}>{value}</Text>
      </Text>
    );
  },
);
const HiveDetailInfoSkeleton = memo(() => {
  const styles = useHiveDetailInfoSkeletonStyles();
  return (
    <View style={styles.container}>
      <View style={[styles.placeholder, styles.title]} />
      <View style={[styles.placeholder, styles.subtitle]} />
      <View style={styles.infoBlock}>
        <View style={[styles.placeholder, styles.infoRow]} />
        <View style={[styles.placeholder, styles.infoRow, { width: '50%' }]} />
        <View style={[styles.placeholder, styles.infoRow, { width: '60%' }]} />
      </View>
    </View>
  );
});
const HiveDetailInfo = memo(({ hive }: HiveDetailInfoProps) => {
  const styles = useHiveDetailInfoStyles();
  const formattedDate = useMemo(
    () => (hive?.acquisition_date ? formatDate(hive.acquisition_date) : null),
    [hive?.acquisition_date],
  );
  const formattedPurchaseValue = useMemo(
    () =>
      hive?.purchase_value !== null && hive?.purchase_value !== undefined
        ? `R$ ${hive.purchase_value.toFixed(2)}`
        : null,
    [hive?.purchase_value],
  );
  if (!hive) {
    return <HiveDetailInfoSkeleton />;
  }
  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>
        <Text style={styles.code}>#{hive.hive_code || 'N/C'}</Text> - {hive.speciesName}
      </Text>
      <Text style={styles.subtitle}>{hive.bee_species_scientific_name}</Text>
      <View style={styles.infoBlock}>
        <InfoRow label="Origem" value={hive.hive_origin} />
        <InfoRow label="Data de Aquisição" value={formattedDate} />
        <InfoRow label="Estado de Origem" value={hive.origin_state_loc} />
        <InfoRow label="Tipo de Caixa" value={hive.box_type} />
        <InfoRow label="Status Atual" value={hive.status} />
        <InfoRow label="Valor da Compra" value={formattedPurchaseValue} />
        <InfoRow label="Descrição" value={hive.description} />
      </View>
    </View>
  );
});
export default HiveDetailInfo;
