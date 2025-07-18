import { useState, useCallback, useRef, useMemo } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useHiveList } from '@/hooks/UseHiveList';
import { ProcessedHiveListItem } from '@/types/DataTypes';
import { getBeeNameByScientificName } from '@/utils/helpers';
const APP_SCHEME = 'meliponia';
export const useQRCodesScreen = () => {
  const params = useLocalSearchParams<{
    filterHiveId?: string;
  }>();
  const router = useRouter();
  const { loading, error, hives, refreshHives } = useHiveList();
  const viewShotRefs = useRef<Record<string, ViewShot | null>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      refreshHives();
    }, [refreshHives]),
  );
  const displayedHives = useMemo(() => {
    const activeHives = hives.filter(hive => hive.status === 'Ativo');
    if (params.filterHiveId) {
      return activeHives.filter(hive => hive.id === params.filterHiveId);
    }
    return activeHives;
  }, [hives, params.filterHiveId]);
  const captureQrCodeAsBase64 = useCallback(async (hiveId: string): Promise<string | null> => {
    const viewShot = viewShotRefs.current[hiveId];
    if (!viewShot) return null;
    try {
      const uri = await viewShot.capture?.();
      return uri || null;
    } catch (e) {
      console.error('Erro ao capturar QR Code:', e);
      return null;
    }
  }, []);
  const handleShare = useCallback(
    async (hive: ProcessedHiveListItem) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        const base64Uri = await captureQrCodeAsBase64(hive.id);
        if (!base64Uri) throw new Error('Falha ao capturar imagem do QR Code.');
        const filename = `${FileSystem.cacheDirectory}qrcode_share_${hive.id}.png`;
        await FileSystem.writeAsStringAsync(filename, base64Uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (!(await Sharing.isAvailableAsync())) {
          throw new Error('Compartilhamento não está disponível neste dispositivo.');
        }
        await Sharing.shareAsync(filename, {
          dialogTitle: `QR Code Colmeia ${hive.hiveCode || hive.id}`,
        });
      } catch (e: any) {
        Alert.alert(
          'Erro ao Compartilhar',
          `Não foi possível compartilhar o arquivo: ${e.message}`,
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, captureQrCodeAsBase64],
  );
  const handlePrint = useCallback(
    async (hive: ProcessedHiveListItem) => {
      if (isProcessing) return;
      setIsProcessing(true);
      try {
        const base64 = await captureQrCodeAsBase64(hive.id);
        if (!base64) throw new Error('Não foi possível gerar imagem do QR Code.');
        const speciesName =
          getBeeNameByScientificName(hive.speciesScientificName) || hive.speciesScientificName;
        const htmlContent = `<html><body style="font-family:sans-serif;text-align:center;padding-top:30px;"><div><h2>Colmeia: #${
          hive.hiveCode || 'S/C'
        }</h2><p>${speciesName}</p><img src="data:image/png;base64,${base64}" style="width:60%;max-width:200px;"/><p style="font-size:9px;color:#777;">${APP_SCHEME}://hive/${
          hive.id
        }</p></div></body></html>`;
        await Print.printAsync({ html: htmlContent, orientation: Print.Orientation.portrait });
      } catch (e: any) {
        Alert.alert('Erro na Impressão', `Não foi possível imprimir o arquivo: ${e.message}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, captureQrCodeAsBase64],
  );
  const navigateToScanner = useCallback(() => {
    console.log('Navigating to QR scanner - useCallback triggered');
    try {
      console.log('Attempting navigation to /hive/qr-scanner');
      router.push('/hive/qr-scanner');
      console.log('Navigation push completed');
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        router.navigate('/hive/qr-scanner');
      } catch (fallbackError) {
        console.error('Fallback navigation error:', fallbackError);
      }
    }
  }, [router]);
  return {
    loading,
    error,
    displayedHives,
    isProcessing,
    viewShotRefs,
    refreshHives,
    handleShare,
    handlePrint,
    navigateToScanner,
    isFiltered: !!params.filterHiveId,
  };
};
