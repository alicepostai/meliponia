import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';
import { DeepLinkingUtils } from '@/utils/deep-linking';
import { hiveService } from '@/services/HiveService';

export const useDeepLinking = () => {
  const router = useRouter();

  const handleDeepLink = useCallback(
    async (url: string) => {
      console.log('Deep link recebido:', url);

      if (!url) return;

      // Verifica se é um QR code de colmeia
      if (DeepLinkingUtils.isHiveQRCode(url)) {
        const hiveId = DeepLinkingUtils.extractHiveIdFromUrl(url);
        if (hiveId) {
          console.log('Navegando para colmeia via deep link:', hiveId);
          router.push(`/hive/${hiveId}`);
        } else {
          Alert.alert('QR Code Inválido', 'Este QR code não é válido para acesso a colmeias.');
        }
        return;
      }

      // Verifica se é um QR code de transferência
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
                  Alert.alert(
                    result.success ? 'Transferência Realizada' : 'Erro na Transferência',
                    result.message,
                    [{ text: 'OK', onPress: () => router.push('/(app)/(tabs)') }],
                  );
                },
              },
            ],
          );
        } catch (error: any) {
          Alert.alert(
            'QR Code de Transferência Inválido',
            error.message || 'Não foi possível processar este QR code de transferência.',
          );
        }
        return;
      }

      // Verifica se é um link de recuperação de senha
      if (DeepLinkingUtils.isSupabaseRecoveryLink(url)) {
        console.log('Processando link de recuperação de senha');
        // Será processado pelo AuthContext
        return;
      }

      console.log('Deep link não reconhecido:', url);
    },
    [router],
  );

  useEffect(() => {
    // Verifica se o app foi aberto por um deep link
    const getInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        console.log('App iniciado via deep link:', initialURL);
        handleDeepLink(initialURL);
      }
    };

    getInitialURL();

    // Escuta novos deep links enquanto o app está rodando
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link recebido enquanto app estava rodando:', url);
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  return { handleDeepLink };
};
