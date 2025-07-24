import { supabase } from './supabase';
import { Alert } from 'react-native';
import { Asset } from 'react-native-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';
import { AlertService } from './AlertService';

export const HIVE_IMAGES_BUCKET_NAME = 'hive-images';
export const AVATARS_BUCKET_NAME = 'avatars';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const validateImageFile = (imageAsset: Asset): { isValid: boolean; error?: string } => {
  if (imageAsset.fileSize && imageAsset.fileSize > MAX_FILE_SIZE) {
    return {
      isValid: false, 
      error: `Arquivo muito grande. Tamanho máximo permitido: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  if (imageAsset.type && !ALLOWED_MIME_TYPES.includes(imageAsset.type.toLowerCase())) {
    return {
      isValid: false,
      error: `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }

  if (imageAsset.fileName) {
    const extension = getFileExtension(imageAsset.fileName);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        isValid: false,
        error: `Extensão de arquivo não permitida. Extensões aceitas: ${ALLOWED_EXTENSIONS.join(', ')}`
      };
    }
  }

  return { isValid: true };
};

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

    logger.error(`StorageService.${context}: Detailed error:`, {
      message: errorMessage,
      details: errorDetails,
    });
  } else if (error instanceof Error) {
    errorMessage = error.message;
    logger.error(`StorageService.${context}: Error occurred:`, error.message);
  } else {
    logger.error(`StorageService.${context}: Unknown error occurred:`, error);
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
      new Error('Invalid image asset data'),
      'uploadImageToStorage',
    );
  }

  const validation = validateImageFile(imageAsset);
  if (!validation.isValid) {
    return handleStorageError(
      new Error(validation.error || 'Invalid file'),
      'uploadImageToStorage'
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
      AlertService.showError(
        'Você está sem conexão. A imagem foi salva e será enviada assim que a internet voltar.',
        {
          title: 'Modo Offline'
        }
      );
      return {
        success: false,
        error: {
          message: 'Upload salvo offline - será processado quando houver conexão',
          details: 'offline',
        },
      };
    } catch (storageError) {
      logger.error('StorageService.uploadImageToStorage: Failed to save offline upload:', storageError);
      return handleStorageError(storageError, 'uploadImageToStorage');
    }
  }

  try {
    logger.info(
      `StorageService.uploadImageToStorage: Starting upload to BUCKET: ${bucketName}, PATH: ${filePath}`,
    );

    const bucketExists = await ensureBucketExists(bucketName);
    if (!bucketExists) {
      throw new Error(
        `StorageService.uploadImageToStorage: Bucket '${bucketName}' does not exist and could not be created - check permissions or create manually`,
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

    logger.info(`StorageService.uploadImageToStorage: Upload successful for ${filePath}`);

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    if (!urlData?.publicUrl) {
      logger.warn(
        `StorageService.uploadImageToStorage: Could not get public URL for ${filePath} after upload`,
      );
      return { success: true, publicUrl: null, error: new Error('StorageService.uploadImageToStorage: Public URL not found') };
    }

    logger.debug(`StorageService.uploadImageToStorage: Public URL obtained for ${filePath}`);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    return handleStorageError(error, 'uploadImageToStorage');
  }
};

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg';
};

export const createHiveImageFilePath = (hiveId: string, fileName: string): string => {
  const extension = getFileExtension(fileName);
  const randomId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return `public/hives/${hiveId}/${randomId}.${extension}`;
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
    logger.info(`StorageService.syncOfflineUploads: Syncing ${uploads.length} offline uploads`);
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
          logger.error('StorageService.syncOfflineUploads: Failed to sync upload:', uploadError);
          remainingUploads.push(upload);
        } else {
          logger.info(`StorageService.syncOfflineUploads: Upload synced: ${filePath}`);
        }
      } catch (error) {
        logger.error('StorageService.syncOfflineUploads: Failed to process offline upload:', error);
        remainingUploads.push(upload);
      }
    }
    await AsyncStorage.setItem(offlineKey, JSON.stringify(remainingUploads));
    if (remainingUploads.length === 0) {
      logger.info('StorageService.syncOfflineUploads: All uploads synced successfully');
    } else {
      logger.warn(`StorageService.syncOfflineUploads: ${remainingUploads.length} uploads failed`);
    }
  } catch (error) {
    logger.error('StorageService.syncOfflineUploads: Error syncing offline uploads:', error);
  }
};

export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucketName).list('', { limit: 1 });

    if (
      error &&
      (error.message.includes('not found') || error.message.includes('does not exist'))
    ) {
      logger.info(`StorageService.ensureBucketExists: Bucket '${bucketName}' does not exist - attempting to create`);

      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 50 * 1024 * 1024,
      });

      if (createError) {
        logger.error(`StorageService.ensureBucketExists: Failed to create bucket '${bucketName}':`, createError);
        return false;
      }

      logger.info(`StorageService.ensureBucketExists: Bucket '${bucketName}' created successfully`);
      return true;
    } else if (error) {
      logger.error(`StorageService.ensureBucketExists: Failed to verify bucket '${bucketName}':`, error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error(`StorageService.ensureBucketExists: Unexpected error verifying bucket '${bucketName}':`, error);
    return false;
  }
};
