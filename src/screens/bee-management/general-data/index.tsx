import React, { memo } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGeneralData } from '@/hooks/UseGeneralData';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DataSection from '@/components/ui/data-section';
import DataRow from '@/components/ui/data-row';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency, formatWeightKg } from '@/utils/helpers';
import { useGeneralDataScreenStyles } from './styles';
import { AggregatedData } from '@/types/DataTypes';
const FeedbackState = memo(({ error, onRetry }: { error: string | null; onRetry: () => void }) => {
  const styles = useGeneralDataScreenStyles();
  const { colors } = useTheme();
  if (error) {
    return (
      <View style={styles.feedbackContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.error} />
        <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.feedbackContainer}>
      <MaterialCommunityIcons name="information-outline" size={60} color={colors.secondary} />
      <Text style={styles.emptyText}>Nenhum dado disponível ainda.</Text>
      <Text style={styles.emptySubText}>
        Cadastre colmeias e registre ações para ver as estatísticas aqui.
      </Text>
    </View>
  );
});
const DataDisplay = memo(({ data }: { data: AggregatedData }) => (
  <>
    <DataSection title="Visão Geral">
      <DataRow label="Total de Colmeias Ativas" value={data.hiveCount} />
      <DataRow label="Espécies Diferentes" value={data.speciesCount} />
    </DataSection>
    <DataSection title="Produção Acumulada">
      <DataRow label="Mel" value={formatWeightKg(data.production.honeyKg)} />
      <DataRow label="Própolis" value={formatWeightKg(data.production.propolisKg)} />
      <DataRow label="Pólen" value={formatWeightKg(data.production.pollenKg)} />
    </DataSection>
    <DataSection title="Transações de Colmeias">
      <DataRow label="Compradas" value={data.transactions.purchasedCount} />
      <DataRow
        label="Valor Gasto em Compras"
        value={formatCurrency(data.transactions.purchaseValue)}
      />
      <DataRow label="Vendidas" value={data.transactions.soldCount} />
      <DataRow label="Valor Obtido em Vendas" value={formatCurrency(data.transactions.saleValue)} />
      <DataRow label="Doadas" value={data.transactions.donatedCount} />
      <DataRow label="Perdidas" value={data.transactions.lostCount} />
    </DataSection>
    <DataSection title="Registros de Manejo">
      <DataRow label="Total de Registros" value={data.actionsSummary.total} />
      <DataRow label="Revisões" value={data.actionsSummary.inspections} />
      <DataRow label="Transferências" value={data.actionsSummary.transfers} />
      <DataRow label="Alimentações" value={data.actionsSummary.feedings} />
      <DataRow label="Colheitas" value={data.actionsSummary.harvests} />
      <DataRow label="Divisões" value={data.actionsSummary.divisions} />
      <DataRow label="Outros Manejos" value={data.actionsSummary.maintenances} />
    </DataSection>
  </>
));
const GeneralDataScreen = memo(() => {
  const { data, loading, error, refreshData } = useGeneralData();
  const { colors } = useTheme();
  const styles = useGeneralDataScreenStyles();
  const renderContent = () => {
    if (loading && !data) {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={colors.honey} />
          <Text style={styles.loadingText}>Carregando dados gerais...</Text>
        </View>
      );
    }
    if (error) {
      return <FeedbackState error={error} onRetry={refreshData} />;
    }
    if (!data) {
      return <FeedbackState error={null} onRetry={refreshData} />;
    }
    return <DataDisplay data={data} />;
  };
  return (
    <ScreenWrapper
      scrollable
      scrollViewProps={{
        refreshControl: (
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshData}
            colors={[colors.honey]}
            tintColor={colors.honey}
          />
        ),
      }}
    >
      {renderContent()}
    </ScreenWrapper>
  );
});
export default GeneralDataScreen;
