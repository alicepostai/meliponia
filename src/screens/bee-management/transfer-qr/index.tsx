import React, { memo, useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import MainButton from '@/components/buttons/main-button';
import { ActionButton } from '@/components/buttons/action-button';
import LoadingOverlay from '@/components/ui/loading-overlay';
import { useTransferQRScreenStyles } from './styles';
import { useHiveDetails } from '@/hooks/UseHiveDetails';
import { getBeeNameByScientificName } from '@/utils/helpers';
import { useCommonNavigation } from '@/hooks/UseCommonNavigation';
interface TransferQRData {
  action: 'transfer_hive';
  hiveId: string;
  sourceUserId: string;
  transferType: 'Venda' | 'Doação';
  timestamp: string;
  expiresAt: string;
}
const TransferQRScreen = memo(() => {
  const styles = useTransferQRScreenStyles();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { navigateToTabs } = useCommonNavigation();
  const params = useLocalSearchParams<{ hiveId: string }>();
  const { hive, loading } = useHiveDetails(params.hiveId);
  const [qrData, setQrData] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const viewShotRef = React.useRef<ViewShot>(null);
  useEffect(() => {
    if (hive && user?.id) {
      const transferData: TransferQRData = {
        action: 'transfer_hive',
        hiveId: hive.id,
        sourceUserId: user.id,
        transferType: hive.status === 'Vendido' ? 'Venda' : 'Doação',
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      setQrData(JSON.stringify(transferData));
    }
  }, [hive, user?.id]);
  const handleShare = async () => {
    if (!viewShotRef.current || isSharing) return;
    setIsSharing(true);
    try {
      const uri = await viewShotRef.current.capture?.();
      if (!uri) throw new Error('Falha ao capturar QR code');
      const filename = `${FileSystem.cacheDirectory}transfer_qr_${hive?.hive_code || hive?.id}.png`;
      await FileSystem.writeAsStringAsync(filename, uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Compartilhamento não disponível');
      }
      await Sharing.shareAsync(filename, {
        dialogTitle: `QR de Transferência - Colmeia ${hive?.hive_code || 'S/C'}`,
      });
    } catch (error: any) {
      Alert.alert(
        'Erro ao Compartilhar',
        `Não foi possível compartilhar o QR code: ${error.message}`,
      );
    } finally {
      setIsSharing(false);
    }
  };

  if (loading || !hive) {
    return (
      <ScreenWrapper>
        <Stack.Screen
          options={{
            title: 'Transferência de Colmeia',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <LoadingOverlay visible={true} text="Carregando..." />
      </ScreenWrapper>
    );
  }
  const speciesName =
    getBeeNameByScientificName(hive.bee_species_scientific_name) ||
    hive.bee_species_scientific_name;
  const transferType = hive.status === 'Vendido' ? 'Venda' : 'Doação';
  return (
    <ScreenWrapper scrollable>
      <Stack.Screen
        options={{
          title: 'Transferência de Colmeia',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.honey} />
          <Text style={styles.title}>Código QR para Transferência</Text>
          <Text style={styles.subtitle}>Compartilhe este código para transferir a colmeia</Text>
        </View>

        <View style={styles.hiveInfo}>
          <Text style={styles.hiveCode}>#{hive.hive_code || 'S/C'}</Text>
          <Text style={styles.species}>{speciesName}</Text>
          <Text style={styles.transferType}>
            {transferType} • {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1.0, result: 'base64' }}
            style={styles.qrWrapper}
          >
            <View style={styles.qrBackground}>
              {qrData ? (
                <QRCode value={qrData} size={200} color="black" backgroundColor="white" />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <MaterialCommunityIcons name="qrcode" size={60} color={colors.textSecondary} />
                </View>
              )}
            </View>
          </ViewShot>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Como usar:</Text>
          <Text style={styles.instructionText}>
            1. Compartilhe este QR code com o novo proprietário
          </Text>
          <Text style={styles.instructionText}>
            2. O novo proprietário deve escanear usando o app Meliponia
          </Text>
          <Text style={styles.instructionText}>3. A colmeia será transferida automaticamente</Text>
        </View>

        <View style={styles.warning}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.warningText}>Este QR code expira em 24 horas</Text>
        </View>

        <View style={styles.actions}>
          <MainButton
            title="Compartilhar QR Code"
            onPress={handleShare}
            loading={isSharing}
            disabled={isSharing}
            style={styles.shareButton}
          />
          <ActionButton
            title="Voltar ao Início"
            onPress={navigateToTabs}
            variant="secondary"
            style={[styles.shareButton, { marginTop: 12, marginBottom: 20 }]}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
});

TransferQRScreen.displayName = 'TransferQRScreen';
export default TransferQRScreen;
