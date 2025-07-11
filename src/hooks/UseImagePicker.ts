import { useState, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  CameraOptions,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
export interface UseImagePickerResult {
  selectedImage: Asset | null;
  pickImageFromGallery: () => void;
  takePhotoWithCamera: () => void;
  showImagePickerOptions: () => void;
  clearSelectedImage: () => void;
  permissionError: string | null;
}
const defaultOptions: CameraOptions & ImageLibraryOptions = {
  mediaType: 'photo',
  includeBase64: false,
  maxHeight: 1024,
  maxWidth: 1024,
  quality: 0.7,
};
export const useImagePicker = (
  options: Partial<CameraOptions & ImageLibraryOptions> = {},
): UseImagePickerResult => {
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const pickerOptions = { ...defaultOptions, ...options };
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Permissão de Câmera',
        message: 'O aplicativo precisa de acesso à sua câmera para tirar fotos.',
        buttonNeutral: 'Pergunte-me Depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionError(null);
        return true;
      }
      setPermissionError('Permissão de câmera negada.');
      Alert.alert('Permissão Negada', 'Você precisa conceder permissão à câmera para tirar fotos.');
      return false;
    } catch (err) {
      console.warn('Error requesting camera permission:', err);
      setPermissionError('Erro ao solicitar permissão da câmera.');
      Alert.alert('Erro', 'Ocorreu um erro ao solicitar permissão da câmera.');
      return false;
    }
  }, []);
  const handleResponse = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return;
    }
    if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorCode, response.errorMessage);
      Alert.alert('Erro', response.errorMessage || 'Não foi possível selecionar a imagem.');
      setSelectedImage(null);
      return;
    }
    if (response.assets && response.assets.length > 0) {
      setSelectedImage(response.assets[0]);
    } else {
      console.warn('ImagePicker response missing assets.');
      setSelectedImage(null);
    }
  }, []);
  const pickImageFromGallery = useCallback(() => {
    setSelectedImage(null);
    setPermissionError(null);
    launchImageLibrary(pickerOptions, handleResponse);
  }, [pickerOptions, handleResponse]);
  const takePhotoWithCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    setSelectedImage(null);
    launchCamera(pickerOptions, handleResponse);
  }, [requestCameraPermission, pickerOptions, handleResponse]);
  const showImagePickerOptions = useCallback(() => {
    Alert.alert(
      'Alterar Imagem',
      'Escolha uma opção:',
      [
        { text: 'Tirar Foto', onPress: takePhotoWithCamera },
        { text: 'Escolher da Galeria', onPress: pickImageFromGallery },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true },
    );
  }, [takePhotoWithCamera, pickImageFromGallery]);
  const clearSelectedImage = useCallback(() => {
    setSelectedImage(null);
  }, []);
  return {
    selectedImage,
    pickImageFromGallery,
    takePhotoWithCamera,
    showImagePickerOptions,
    clearSelectedImage,
    permissionError,
  };
};
