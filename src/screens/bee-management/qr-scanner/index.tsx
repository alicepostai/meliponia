import React, { useState, useEffect, memo } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import { useRouter, Stack } from 'expo-router';
import { hiveService } from '@/services/HiveService';
import LoadingOverlay from '@/components/ui/loading-overlay';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import { usePermissionContext } from '@/contexts/PermissionContext';
import { useQRScannerScreenStyles } from './styles';
import { DeepLinkingUtils } from '@/utils/deep-linking';
const APP_SCHEME = 'meliponia';
const QRScannerScreen = memo(() => {
  const styles = useQRScannerScreenStyles();
  const { status, requestCameraPermission } = usePermissionContext();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  console.log('QRScannerScreen render', {
    cameraPermission: status.camera,
    loading: status.loading,
  });

  useEffect(() => {
    console.log('QRScannerScreen useEffect permission check');
    if (!status.camera && !status.loading) {
      console.log('Requesting camera permission...');
      requestCameraPermission();
    }
  }, [status.camera, status.loading, requestCameraPermission]);
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    console.log('QR Code escaneado:', data);

    // Verifica se é um QR code de colmeia
    if (DeepLinkingUtils.isHiveQRCode(data)) {
      const hiveId = DeepLinkingUtils.extractHiveIdFromUrl(data);
      if (hiveId) {
        console.log('Navegando para colmeia:', hiveId);
        router.replace(`/hive/${hiveId}`);
      } else {
        Alert.alert('QR Code Inválido', 'Este QR code não é válido para acesso a colmeias.', [
          { text: 'OK', onPress: () => setScanned(false) },
        ]);
      }
    }
    // Verifica se é um QR code de transferência
    else if (DeepLinkingUtils.isTransferQRCode(data)) {
      try {
        let transferData;
        if (data.startsWith(`${APP_SCHEME}://transfer`)) {
          const url = new URL(data);
          transferData = {
            hiveId: url.searchParams.get('hiveId'),
            sourceUserId: url.searchParams.get('sourceUserId'),
            transferType: url.searchParams.get('type'),
          };
        } else {
          const parsed = JSON.parse(data);
          if (parsed.action !== 'transfer_hive') {
            throw new Error('Formato de QR code inválido');
          }
          if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
            throw new Error('Este QR code de transferência expirou');
          }
          transferData = {
            hiveId: parsed.hiveId,
            sourceUserId: parsed.sourceUserId,
            transferType: parsed.transferType,
          };
        }
        const { hiveId, sourceUserId, transferType } = transferData;
        if (!hiveId || !sourceUserId || !transferType) {
          throw new Error('QR Code de transferência inválido ou incompleto.');
        }
        Alert.alert(
          'Confirmar Transferência',
          `Você está prestes a receber uma nova colmeia por ${transferType.toLowerCase()}. Esta ação não pode ser desfeita. Deseja continuar?`,
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => setScanned(false) },
            {
              text: 'Confirmar Transferência',
              onPress: async () => {
                setIsProcessing(true);
                const result = await hiveService.processHiveTransfer(
                  hiveId,
                  sourceUserId,
                  transferType,
                );
                setIsProcessing(false);
                Alert.alert(
                  result.success ? 'Transferência Realizada' : 'Erro na Transferência',
                  result.message,
                  [{ text: 'OK', onPress: () => router.replace('/(app)/(tabs)') }],
                );
              },
            },
          ],
        );
      } catch (e: any) {
        Alert.alert(
          'QR Code de Transferência Inválido',
          e.message || 'Não foi possível processar este QR code de transferência.',
          [{ text: 'OK', onPress: () => setScanned(false) }],
        );
      }
    } else {
      Alert.alert(
        'QR Code Não Reconhecido',
        'Este QR code não é compatível com o aplicativo Meliponia.',
        [{ text: 'OK', onPress: () => setScanned(false) }],
      );
    }
  };
  if (status.loading) {
    return <ScreenWrapper children={undefined} />;
  }
  if (!status.camera) {
    return (
      <ScreenWrapper>
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackText}>
            Sem acesso à câmera. Por favor, habilite nas configurações do seu dispositivo.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        style={styles.camera}
      />
      {scanned && !isProcessing && (
        <View style={styles.rescanButtonContainer}>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={() => setScanned(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.rescanButtonText}>Escanear Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
      <LoadingOverlay visible={isProcessing} text="Processando transferência..." />
    </View>
  );
});
QRScannerScreen.displayName = 'QRScannerScreen';
export default QRScannerScreen;
