import { supabase } from './supabase';
import { Alert } from 'react-native';
import { Asset } from 'react-native-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HIVE_IMAGES_BUCKET_NAME = 'hive-images';
export const AVATARS_BUCKET_NAME = 'avatars';

interface UploadResult {
  success: boolean;
  publicUrl?: string | null;
  error?: Error | any;
}

const handleStorageError = (error: unknown, context: string): UploadResult => {
  let errorMessage = 'Ocorreu um erro desconhecido.';
  let errorDetails = '';

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      errorMessage = error.message;
    }
    if ('details' in error && typeof error.details === 'string') {
      errorDetails = error.details;
    }
    if ('hint' in error && typeof error.hint === 'string') {
      errorDetails += ` Dica: ${error.hint}`;
    }

    console.error(`StorageService: Erro detalhado durante ${context}:`, {
      error,
      message: errorMessage,
      details: errorDetails,
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });
  } else if (error instanceof Error) {
    errorMessage = error.message;
    console.error(`StorageService: Error durante ${context}:`, error.message, error.stack);
  } else {
    console.error(`StorageService: Erro desconhecido durante ${context}:`, error);
  }

  return {
    success: false,
    error: {
      message: errorMessage,
      details: errorDetails,
      originalError: error,
    },
  };
};

export const uploadImageToStorage = async (
  bucketName: string,
  filePath: string,
  imageAsset: Asset,
): Promise<UploadResult> => {
  if (!imageAsset.uri || !imageAsset.type) {
    return handleStorageError(
      new Error('Dados do asset de imagem inválidos.'),
      'validação de asset',
    );
  }

  const netState = await NetInfo.fetch();
  if (!netState.isConnected || !netState.isInternetReachable) {
    try {
      const offlineKey = 'offline_image_uploads';
      const existingUploads = await AsyncStorage.getItem(offlineKey);
      const uploads = existingUploads ? JSON.parse(existingUploads) : [];
      uploads.push({
        id: `offline_upload_${Date.now()}_${Math.random()}`,
        bucketName,
        filePath,
        imageAsset: {
          uri: imageAsset.uri,
          fileName: imageAsset.fileName,
          type: imageAsset.type,
        },
        createdAt: Date.now(),
      });
      await AsyncStorage.setItem(offlineKey, JSON.stringify(uploads));
      Alert.alert(
        'Modo Offline',
        'Você está sem conexão. A imagem foi salva e será enviada assim que a internet voltar.',
      );
      return {
        success: false,
        error: {
          message: 'Upload salvo offline - será processado quando houver conexão',
          details: 'offline',
        },
      };
    } catch (storageError) {
      console.error('Erro ao salvar upload offline:', storageError);
      return handleStorageError(storageError, 'salvamento offline');
    }
  }

  try {
    console.log(
      `StorageService: Iniciando upload para BUCKET: ${bucketName}, CAMINHO: ${filePath}`,
    );

    const bucketExists = await ensureBucketExists(bucketName);
    if (!bucketExists) {
      throw new Error(
        `Bucket '${bucketName}' não existe e não foi possível criá-lo. Verifique as permissões ou crie-o manualmente no painel do Supabase.`,
      );
    }

    const formData = new FormData();
    formData.append('file', {
      uri: imageAsset.uri,
      name: imageAsset.fileName || 'upload.jpg',
      type: imageAsset.type,
    } as any);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, formData, {
        cacheControl: '3600',
        upsert: true,
        contentType: imageAsset.type,
      });

    if (uploadError) throw uploadError;

    console.log(`StorageService: Upload bem-sucedido:`, uploadData);

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!urlData?.publicUrl) {
      console.warn(
        `StorageService: Não foi possível obter URL pública para ${filePath} após upload.`,
      );
      return { success: true, publicUrl: null, error: new Error('URL pública não encontrada.') };
    }

    console.log(`StorageService: URL Pública obtida:`, urlData.publicUrl);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    return handleStorageError(error, `upload para ${bucketName}`);
  }
};

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
};

export const createHiveImageFilePath = (hiveId: string, fileName: string): string => {
  const extension = getFileExtension(fileName);
  return `public/hives/${hiveId}/${Date.now()}.${extension}`;
};

export const createAvatarFilePath = (userId: string, fileName: string): string => {
  const extension = getFileExtension(fileName);
  return `public/${userId}/avatar.${extension}`;
};

export const syncOfflineUploads = async (): Promise<void> => {
  try {
    const offlineKey = 'offline_image_uploads';
    const existingUploads = await AsyncStorage.getItem(offlineKey);
    if (!existingUploads) return;
    const uploads = JSON.parse(existingUploads);
    if (uploads.length === 0) return;
    console.log(`StorageService: Sincronizando ${uploads.length} uploads offline.`);
    const remainingUploads = [];
    for (const upload of uploads) {
      try {
        const { bucketName, filePath, imageAsset } = upload;
        const formData = new FormData();
        formData.append('file', {
          uri: imageAsset.uri,
          name: imageAsset.fileName || 'upload.jpg',
          type: imageAsset.type,
        } as any);
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, formData, {
            cacheControl: '3600',
            upsert: true,
            contentType: imageAsset.type,
          });
        if (uploadError) {
          console.error('Erro ao sincronizar upload:', uploadError);
          remainingUploads.push(upload);
        } else {
          console.log(`StorageService: Upload sincronizado: ${filePath}`);
        }
      } catch (error) {
        console.error('Erro ao processar upload offline:', error);
        remainingUploads.push(upload);
      }
    }
    await AsyncStorage.setItem(offlineKey, JSON.stringify(remainingUploads));
    if (remainingUploads.length === 0) {
      console.log('StorageService: Todos os uploads foram sincronizados.');
    } else {
      console.warn(`StorageService: ${remainingUploads.length} uploads falharam.`);
    }
  } catch (error) {
    console.error('StorageService: Erro ao sincronizar uploads offline:', error);
  }
};

export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucketName).list('', { limit: 1 });

    if (
      error &&
      (error.message.includes('not found') || error.message.includes('does not exist'))
    ) {
      console.log(`StorageService: Bucket '${bucketName}' não existe. Tentando criar...`);

      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 50 * 1024 * 1024,
      });

      if (createError) {
        console.error(`StorageService: Erro ao criar bucket '${bucketName}':`, createError);
        return false;
      }

      console.log(`StorageService: Bucket '${bucketName}' criado com sucesso!`);
      return true;
    } else if (error) {
      console.error(`StorageService: Erro ao verificar bucket '${bucketName}':`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`StorageService: Erro inesperado ao verificar bucket '${bucketName}':`, error);
    return false;
  }
};
