import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHiveDetails } from '@/hooks/UseHiveDetails';
import { useImagePicker } from '@/hooks/UseImagePicker';
import { hiveService } from '@/services/HiveService';
import {
  uploadImageToStorage,
  createHiveImageFilePath,
  HIVE_IMAGES_BUCKET_NAME,
} from '@/services/StorageService';
import { getBeeImageUrlById } from '@/utils/helpers';
type HiveActionScreenPath =
  | 'actions/feeding'
  | 'actions/harvest'
  | 'actions/inspection'
  | 'actions/maintenance'
  | 'actions/division'
  | 'actions/box-transfer';
export const useHiveScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ hiveId?: string }>();
  const hiveId = params.hiveId;
  const { hive, timeline, loading, error, refreshData, deleteTimelineItem } =
    useHiveDetails(hiveId);
  const { selectedImage, showImagePickerOptions, clearSelectedImage } = useImagePicker();
  const [isUploading, setIsUploading] = useState(false);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const displayImageUri = useMemo(() => {
    if (selectedImage?.uri) return selectedImage.uri;
    if (hive?.image_url) return hive.image_url;
    if (hive) return getBeeImageUrlById(hive.bee_species_id);
    return undefined;
  }, [hive, selectedImage]);
  useEffect(() => {
    const uploadAndRefresh = async () => {
      if (!selectedImage?.uri || !selectedImage.fileName || !hiveId) return;
      setIsUploading(true);

      try {
        const filePath = createHiveImageFilePath(hiveId, selectedImage.fileName);
        const uploadResult = await uploadImageToStorage(
          HIVE_IMAGES_BUCKET_NAME,
          filePath,
          selectedImage,
        );

        if (uploadResult.success && uploadResult.publicUrl) {
          const updateResult = await hiveService.updateHive(hiveId, {
            image_url: uploadResult.publicUrl,
          });

          if (updateResult.data) {
            refreshData(false);
          } else if (updateResult.error?.code === 'OFFLINE') {
            Alert.alert(
              'Modo Offline',
              'Sua alteração foi salva e será enviada quando você estiver online.',
            );
          } else {
            console.error('Erro ao atualizar hive no banco:', updateResult.error);
            Alert.alert(
              'Erro no Banco',
              updateResult.error?.message || 'Falha ao salvar URL da imagem no banco de dados.',
            );
          }
        } else if (uploadResult.error?.details === 'offline') {
          Alert.alert(
            'Modo Offline',
            'Sua imagem foi salva e será enviada quando você estiver online.',
          );
        } else {
          console.error('Erro no upload da imagem:', uploadResult.error);

          const errorMessage = uploadResult.error?.message || 'Não foi possível enviar a imagem.';
          let alertTitle = 'Erro de Upload';
          let alertMessage = errorMessage;

          if (
            errorMessage.includes('bucket') ||
            errorMessage.includes('storage') ||
            errorMessage.includes('not found') ||
            errorMessage.includes('does not exist')
          ) {
            alertTitle = 'Erro de Configuração';
            alertMessage =
              'O storage não está configurado corretamente no Supabase. Verifique se os buckets "hive-images" foram criados e se as políticas de acesso estão configuradas.\n\nConsulte o arquivo SUPABASE_STORAGE_SETUP.md para instruções detalhadas.';
          } else if (
            errorMessage.includes('permission') ||
            errorMessage.includes('access') ||
            errorMessage.includes('denied') ||
            errorMessage.includes('unauthorized')
          ) {
            alertTitle = 'Erro de Permissão';
            alertMessage =
              'Você não tem permissão para fazer upload de imagens. Verifique se está logado e se as políticas RLS do Supabase estão configuradas corretamente.';
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            alertTitle = 'Erro de Conexão';
            alertMessage = 'Verifique sua conexão com a internet e tente novamente.';
          }

          Alert.alert(alertTitle, alertMessage);
        }
      } catch (error) {
        console.error('Erro inesperado no upload:', error);
        Alert.alert(
          'Erro Inesperado',
          'Ocorreu um erro inesperado ao processar a imagem. Tente novamente.',
        );
      } finally {
        clearSelectedImage();
        setIsUploading(false);
      }
    };

    uploadAndRefresh();
  }, [selectedImage, hiveId, clearSelectedImage, refreshData]);
  const openHeaderMenu = useCallback(() => {
    setIsHeaderMenuVisible(true);
  }, []);
  const closeHeaderMenu = useCallback(() => {
    setIsHeaderMenuVisible(false);
  }, []);
  const navigateToEdit = useCallback(() => {
    if (!hiveId) return;
    closeHeaderMenu();
    router.push(`/hive/edit/${hiveId}`);
  }, [router, hiveId, closeHeaderMenu]);
  const navigateToOutgoing = useCallback(() => {
    if (!hiveId) return;
    closeHeaderMenu();
    router.push({ pathname: '/hive/hive-outgoing', params: { hiveId } });
  }, [router, hiveId, closeHeaderMenu]);
  const navigateToQrCode = useCallback(() => {
    if (!hiveId) return;
    closeHeaderMenu();
    router.push({ pathname: '/(app)/hive/qr-codes', params: { filterHiveId: hiveId } });
  }, [router, hiveId, closeHeaderMenu]);

  const navigateToActionScreen = useCallback(
    (screenPath: HiveActionScreenPath) => {
      if (!hiveId) return;
      const absolutePath = `/(app)/${screenPath}` as const;
      router.push({ pathname: absolutePath, params: { hiveId } });
    },
    [router, hiveId],
  );
  const handleDeleteHive = useCallback(async () => {
    if (!hiveId) return;
    closeHeaderMenu();
    const result = await hiveService.deleteHiveCascade(hiveId);
    if (result.success) {
      if (router.canGoBack()) router.back();
      else router.replace('/(app)/(tabs)');
    }
  }, [hiveId, router, closeHeaderMenu]);
  const headerMenuOptions = useMemo(
    () =>
      hiveId
        ? [
            { label: 'Editar Dados', icon: 'pencil-outline', onPress: navigateToEdit },
            { label: 'Ver QR Code', icon: 'qrcode', onPress: navigateToQrCode },
            { label: 'Registrar Saída', icon: 'logout-variant', onPress: navigateToOutgoing },
            {
              label: 'Excluir Colmeia',
              icon: 'trash-can-outline',
              onPress: handleDeleteHive,
              isDestructive: true,
            },
          ]
        : [],
    [hiveId, navigateToEdit, navigateToQrCode, navigateToOutgoing, handleDeleteHive],
  );
  const fabOptions = useMemo(
    () => [
      {
        label: 'Divisão',
        icon: 'call-split',
        onPress: () => navigateToActionScreen('actions/division'),
      },
      {
        label: 'Revisão',
        icon: 'check-circle-outline',
        onPress: () => navigateToActionScreen('actions/inspection'),
      },
      {
        label: 'Alimentação',
        icon: 'bee-flower',
        onPress: () => navigateToActionScreen('actions/feeding'),
      },
      {
        label: 'Transferência',
        icon: 'transfer',
        onPress: () => navigateToActionScreen('actions/box-transfer'),
      },
      {
        label: 'Colheita',
        icon: 'beehive-outline',
        onPress: () => navigateToActionScreen('actions/harvest'),
      },
      {
        label: 'Manejo',
        icon: 'beekeeper',
        onPress: () => navigateToActionScreen('actions/maintenance'),
      },
    ],
    [navigateToActionScreen],
  );
  return {
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
  };
};
