import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { DeepLinkingUtils } from '@/utils/deep-linking';
import { hiveService } from '@/services/HiveService';
import { logger } from '@/utils/logger';
import { AlertService } from '@/services/AlertService';

export const useDeepLinking = () => {
  const router = useRouter();

  const handleDeepLink = useCallback(
    async (url: string) => {
      logger.debug('Deep link recebido:', url);

      if (!url) return;

      if (DeepLinkingUtils.isHiveQRCode(url)) {
        const hiveId = DeepLinkingUtils.extractHiveIdFromUrl(url);
        if (hiveId) {
          logger.info('Navegando para colmeia via deep link:', hiveId);
          router.push(`/hive/${hiveId}`);
        } else {
          AlertService.showError('Este QR code não é válido para acesso a colmeias.', {
            title: 'QR Code Inválido'
          });
        }
        return;
      }

      if (DeepLinkingUtils.isTransferQRCode(url)) {
        try {
          let transferData;
          if (url.startsWith('meliponia://transfer')) {
            const urlObj = new URL(url);
            transferData = {
              hiveId: urlObj.searchParams.get('hiveId'),
              sourceUserId: urlObj.searchParams.get('sourceUserId'),
              transferType: urlObj.searchParams.get('type'),
            };
          } else {
            const parsed = JSON.parse(url);
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
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Confirmar Transferência',
                onPress: async () => {
                  const result = await hiveService.processHiveTransfer(
                    hiveId,
                    sourceUserId,
                    transferType,
                  );
                  if (result.success) {
                    AlertService.showSuccess(result.message, {
                      title: 'Transferência Realizada',
                      onAction: () => router.push('/(app)/(tabs)')
                    });
                  } else {
                    AlertService.showError(result.message, {
                      title: 'Erro na Transferência'
                    });
                  }
                },
              },
            ],
          );
        } catch (error: any) {
          AlertService.showError(
            error.message || 'Não foi possível processar este QR code de transferência.',
            {
              title: 'QR Code de Transferência Inválido'
            }
          );
        }
        return;
      }

      if (DeepLinkingUtils.isSupabaseRecoveryLink(url)) {
        logger.debug('Processando link de recuperação de senha');
        return;
      }

      logger.warn('Deep link não reconhecido:', url);
    },
    [router],
  );

  useEffect(() => {
    const getInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        logger.info('App iniciado via deep link:', initialURL);
        handleDeepLink(initialURL);
      }
    };

    getInitialURL();

    const subscription = Linking.addEventListener('url', ({ url }) => {
      logger.debug('Deep link recebido enquanto app estava rodando:', url);
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  return { handleDeepLink };
};
