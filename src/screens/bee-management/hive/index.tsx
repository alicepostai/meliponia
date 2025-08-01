import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Stack, useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import HiveDetailHeader from '@/components/header/hive-details-header';
import HiveDetailInfo from '@/components/hive/hive-detail-info';
import HiveDetailTimeline from '@/components/hive/hive-detail-timeline';
import FabWithOptions from '@/components/menu/fab-with-options';
import FastOptionsMenu from '@/components/menu/fast-options-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { useHiveScreenStyles } from './styles';
import { useHiveScreen } from './UseHiveScreen';
import { fonts } from '@/theme/fonts';
import { logger } from '@/utils/logger';
const ListHeader = memo(
  ({
    hive,
    displayImageUri,
    showImagePickerOptions,
    isUploading,
  }: {
    hive: ReturnType<typeof useHiveScreen>['hive'];
    displayImageUri: ReturnType<typeof useHiveScreen>['displayImageUri'];
    showImagePickerOptions: () => void;
    isUploading: boolean;
  }) => {
    const styles = useHiveScreenStyles();
    if (!hive) return null;
    return (
      <>
        <HiveDetailHeader
          displayImageUri={displayImageUri}
          speciesName={hive.speciesName}
          onSelectNewImage={showImagePickerOptions}
          isUploadingImage={isUploading}
        />
        <HiveDetailInfo hive={hive} />
        <Text style={styles.timelineTitle}>Histórico de Eventos</Text>
      </>
    );
  },
);

ListHeader.displayName = 'ListHeader';
const FeedbackState = memo(
  ({
    error,
    onRetry,
    onBack,
  }: {
    error: string | null;
    onRetry: (showLoading: boolean) => void;
    onBack: () => void;
  }) => {
    const styles = useHiveScreenStyles();
    const { colors } = useTheme();
    const message = error || 'Colmeia não encontrada.';
    return (
      <View style={styles.centeredMessage} accessible={true} accessibilityRole="alert">
        <Text style={styles.errorText}>{message}</Text>
        <TouchableOpacity
          onPress={error ? () => onRetry(true) : onBack}
          style={[styles.retryButton, { backgroundColor: colors.honey }]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={error ? 'Tentar carregar novamente' : 'Voltar para a tela anterior'}
          accessibilityHint={
            error ? 'Tenta carregar os dados da colmeia novamente' : 'Retorna para a tela anterior'
          }
        >
          <Text style={[styles.retryButtonText, { color: colors.white }]}>
            {error ? 'Tentar Novamente' : 'Voltar'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
);

FeedbackState.displayName = 'FeedbackState';

const HiveScreen = memo(() => {
  const styles = useHiveScreenStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const {
    hive,
    timeline,
    loading,
    error,
    refreshData,
    deleteTimelineItem,
    isUploading,
    displayImageUri,
    showImagePickerOptions,
    isHeaderMenuVisible,
    openHeaderMenu,
    closeHeaderMenu,
    headerMenuOptions,
    fabOptions,
  } = useHiveScreen();
  const renderContent = () => {
    if (loading && !hive) {
      return (
        <View
          style={styles.centeredMessage}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel="Carregando dados da colmeia"
          accessibilityState={{ busy: true }}
        >
          <ActivityIndicator size="large" color={colors.honey} />
          <Text style={styles.loadingText}>Carregando Colmeia...</Text>
        </View>
      );
    }
    if (error || !hive) {
      return <FeedbackState error={error} onRetry={refreshData} onBack={() => router.back()} />;
    }
    return (
      <HiveDetailTimeline
        timeline={timeline}
        loading={loading}
        error={null}
        onDeleteAction={deleteTimelineItem}
        ListHeaderComponent={
          <ListHeader
            hive={hive}
            displayImageUri={displayImageUri}
            showImagePickerOptions={showImagePickerOptions}
            isUploading={isUploading}
          />
        }
        onRefresh={() => refreshData(true)}
        isRefreshing={loading}
      />
    );
  };
  return (
    <ScreenWrapper noPadding style={styles.container}>
      <Stack.Screen
        options={{
          title: hive ? `Colmeia #${hive.hive_code || '...'}` : 'Carregando...',
          headerStyle: { backgroundColor: colors.headerBackground },
          headerTintColor: colors.headerText,
          headerTitleStyle: { color: colors.headerText, fontFamily: fonts.SemiBold },
          headerRight: () =>
            hive ? (
              <TouchableOpacity
                onPress={() => {
                  logger.debug('Header menu button pressed');
                  openHeaderMenu();
                }}
                style={styles.headerMenuButton}
                activeOpacity={0.7}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Opções da colmeia"
                accessibilityHint="Abre o menu com opções adicionais para esta colmeia"
              >
                <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.headerText} />
              </TouchableOpacity>
            ) : null,
        }}
      />
      {renderContent()}
      {hive && (
        <FastOptionsMenu
          isVisible={isHeaderMenuVisible}
          onDismiss={closeHeaderMenu}
          options={headerMenuOptions}
          topOffset={5}
        />
      )}
      {hive && !error && <FabWithOptions options={fabOptions} />}
    </ScreenWrapper>
  );
});

HiveScreen.displayName = 'HiveScreen';

export default HiveScreen;
