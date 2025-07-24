import React, { memo, useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import HeaderActionButton from '@/components/buttons/header-action-button';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/hooks/UseTutorial';
import { useQRCodesScreenStyles, useQRCodeItemStyles } from './styles';
import { useQRCodesScreen } from './UseQRCodesScreen';
import { ProcessedHiveListItem } from '@/types/DataTypes';
import { getBeeNameByScientificName } from '@/utils/helpers';
import { DeepLinkingUtils } from '@/utils/deep-linking';
const FeedbackState = memo(
  ({ type, onRetry }: { type: 'loading' | 'error' | 'empty'; onRetry: () => void }) => {
    const styles = useQRCodesScreenStyles();
    const { colors } = useTheme();
    if (type === 'loading') {
      return (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color={colors.honey} />
        </View>
      );
    }
    if (type === 'error') {
      return (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, styles.errorText]}>Erro ao carregar colmeias.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
            <MaterialCommunityIcons name="reload" size={16} color={colors.white} />
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.feedbackContainer}>
        <MaterialCommunityIcons name="qrcode-scan" size={60} color={colors.textSecondary} />
        <Text style={styles.feedbackText}>Nenhuma colmeia ativa encontrada.</Text>
      </View>
    );
  },
);

FeedbackState.displayName = 'FeedbackState';

const QRCodeItem = memo(
  ({
    item,
    isProcessing,
    onShare,
    onPrint,
    viewShotRef,
  }: {
    item: ProcessedHiveListItem;
    isProcessing: boolean;
    onShare: () => void;
    onPrint: () => void;
    viewShotRef: (ref: ViewShot | null) => void;
  }) => {
    const styles = useQRCodeItemStyles();
    const { colors } = useTheme();

    const qrData = DeepLinkingUtils.generateHiveQRData(
      item.id,
      item.hiveCode || undefined,
      getBeeNameByScientificName(item.speciesScientificName) || undefined,
    );

    const speciesName =
      getBeeNameByScientificName(item.speciesScientificName) || item.speciesScientificName;
    const [isQrVisible, setIsQrVisible] = useState(false);
    const handleAction = (action: () => void) => {
      if (!isQrVisible) {
        setIsQrVisible(true);
        setTimeout(() => {
          action();
        }, 100);
      } else {
        action();
      }
    };
    return (
      <View style={styles.hiveItemContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.9, result: 'base64' }}
          style={styles.snapshotView}
        >
          <View style={styles.qrCodeContainer}>
            {isQrVisible ? (
              <QRCode
                value={qrData}
                size={120}
                color="black"
                backgroundColor="white"
                logo={require('@/assets/images/icon.png')}
                logoSize={20}
                logoBackgroundColor="white"
                logoMargin={2}
              />
            ) : (
              <TouchableOpacity
                style={styles.qrPlaceholder}
                onPress={() => setIsQrVisible(true)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="qrcode" size={50} color={colors.secondary} />
                <Text style={styles.qrPlaceholderText}>Gerar QR</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.qrInfoContainer}>
            <Text style={styles.qrInfoText}>Colmeia #{item.hiveCode || 'S/C'}</Text>
            <Text style={styles.qrInfoSpecies}>{speciesName}</Text>
            <Text style={styles.qrInfoSubtext}>
              Escaneie com a câmera do celular{'\n'}ou do app para acessar
            </Text>
          </View>
        </ViewShot>
        <View style={styles.hiveInfoContainer}>
          <Text style={styles.hiveCodeText}>#{item.hiveCode || 'S/C'}</Text>
          <Text style={styles.speciesText}>{speciesName}</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.honey }]}
              onPress={() => handleAction(onShare)}
              disabled={isProcessing}
              activeOpacity={isProcessing ? 1 : 0.7}
            >
              <MaterialCommunityIcons name="share-variant-outline" size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.printButton, { backgroundColor: colors.primary }]}
              onPress={() => handleAction(onPrint)}
              disabled={isProcessing}
              activeOpacity={isProcessing ? 1 : 0.7}
            >
              <MaterialCommunityIcons name="printer-outline" size={16} color={colors.white} />
              <Text style={styles.actionButtonText}>Imprimir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

QRCodeItem.displayName = 'QRCodeItem';

const QRCodesScreen = memo(() => {
  const styles = useQRCodesScreenStyles();
  const {
    loading,
    error,
    displayedHives,
    isProcessing,
    viewShotRefs,
    refreshHives,
    handleShare,
    handlePrint,
    navigateToScanner,
  } = useQRCodesScreen();

  const tutorialSteps = [
    {
      id: '1',
      title: 'QR Codes das Colmeias',
      description:
        'Nesta tela você pode visualizar e compartilhar QR codes de todas as suas colmeias ativas.',
      position: 'center' as const,
    },
    {
      id: '2',
      title: 'Lista de QR Codes',
      description:
        'Aqui estão listados os QR codes de todas as colmeias. Cada QR code contém um link direto para os detalhes da colmeia.',
      position: 'bottom' as const,
    },
    {
      id: '3',
      title: 'Compartilhar e Imprimir',
      description:
        'Para cada colmeia, você pode compartilhar o QR code ou imprimir usando os botões de ação ao lado de cada item.',
      position: 'bottom' as const,
    },
    {
      id: '4',
      title: 'Escanear QR Code',
      description:
        'No canto superior direito há um botão para escanear QR codes de outras colmeias ou acessar funcionalidades rapidamente.',
      position: 'top' as const,
    },
  ];

  const tutorial = useTutorial({
    tutorialKey: 'qr-codes',
    steps: tutorialSteps,
    autoStart: true,
    delay: 1000,
  });

  const renderItem = useCallback(
    ({ item }: { item: ProcessedHiveListItem }) => (
      <QRCodeItem
        item={item}
        isProcessing={isProcessing}
        onShare={() => handleShare(item)}
        onPrint={() => handlePrint(item)}
        viewShotRef={ref => (viewShotRefs.current[item.id] = ref)}
      />
    ),
    [isProcessing, handleShare, handlePrint, viewShotRefs],
  );
  const keyExtractor = useCallback((item: ProcessedHiveListItem) => item.id, []);
  const renderContent = () => {
    if (loading && displayedHives.length === 0)
      return <FeedbackState type="loading" onRetry={refreshHives} />;
    if (error) return <FeedbackState type="error" onRetry={refreshHives} />;
    return (
      <FlatList
        data={displayedHives}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={<FeedbackState type="empty" onRetry={refreshHives} />}
        refreshing={loading}
        onRefresh={refreshHives}
      />
    );
  };
  return (
    <ScreenWrapper noPadding>
      <Stack.Screen
        options={{
          title: 'QR Codes',
          headerRight: () => (
            <HeaderActionButton
              iconName="qrcode-scan"
              accessibilityLabel="Escanear QR Code"
              onPress={navigateToScanner}
            />
          ),
        }}
      />
      {renderContent()}

      <TutorialOverlay
        steps={tutorial.steps}
        visible={tutorial.isVisible}
        onComplete={tutorial.completeTutorial}
        onSkip={tutorial.skipTutorial}
      />
    </ScreenWrapper>
  );
});

QRCodesScreen.displayName = 'QRCodesScreen';

export default QRCodesScreen;
