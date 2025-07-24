import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useImagePicker } from '@/hooks/UseImagePicker';
import { useCommonNavigation } from '@/hooks/UseCommonNavigation';
import { profileService } from '@/services/ProfileService';
import { serviceRegistry } from '@/services/ServiceRegistry';
import {
  uploadImageToStorage,
  createAvatarFilePath,
  AVATARS_BUCKET_NAME,
} from '@/services/StorageService';
import { DbProfile } from '@/types/supabase';
import { AlertService } from '@/services/AlertService';
import { logger } from '@/utils/logger';
export const useProfileScreen = () => {
  const { user, logout } = useAuth();
  const { navigateToChangePassword } = useCommonNavigation();
  const { selectedImage, pickImageFromGallery, takePhotoWithCamera, clearSelectedImage } =
    useImagePicker();
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingFullName, setEditingFullName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [userStats, setUserStats] = useState({
    hivesCount: 0,
    actionsCount: 0,
    daysActive: 0,
  });
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        setLoading(true);
        const { data } = await profileService.getProfile(user.id);
        if (data) {
          setProfile(data);
          setEditingFullName(data.full_name || '');
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?.id) {
        try {
          const hivesResult = await serviceRegistry
            .getHiveService()
            .fetchHivesByUserId(user.id, 'Todas');
          const hivesCount = hivesResult.data?.length || 0;

          const actionsResult = await serviceRegistry.getActionService().fetchActionHistory();
          const actionsCount = actionsResult.data?.length || 0;

          const createdAt = new Date(user.created_at || Date.now());
          const now = new Date();
          const timeDiff = now.getTime() - createdAt.getTime();
          const daysActive = Math.floor(timeDiff / (1000 * 3600 * 24));

          setUserStats({
            hivesCount,
            actionsCount,
            daysActive: Math.max(0, daysActive),
          });
        } catch (error) {
          logger.error('Erro ao buscar estatísticas:', error);
        }
      }
    };

    fetchUserStats();
  }, [user?.id, user?.created_at]);
  useEffect(() => {
    const uploadAvatar = async () => {
      if (!selectedImage?.uri || !user?.id) return;

      setIsUploading(true);

      try {
        const filePath = createAvatarFilePath(user.id, selectedImage.fileName || 'avatar.jpg');
        const { success, publicUrl, error } = await uploadImageToStorage(
          AVATARS_BUCKET_NAME,
          filePath,
          selectedImage,
        );

        if (success && publicUrl) {
          const { data } = await profileService.updateProfile(user.id, { avatar_url: publicUrl });
          if (data) {
            const updatedProfile = {
              ...data,
              avatar_url: data.avatar_url ? `${data.avatar_url}?t=${Date.now()}` : data.avatar_url,
            };
            setProfile(updatedProfile);
          } else {
            AlertService.showError(
              'A foto foi enviada, mas não foi possível atualizar seu perfil. Tente novamente.',
            );
          }
        } else if (error?.details === 'offline') {
          Alert.alert(
            'Modo Offline',
            'Sua imagem foi salva e será enviada quando você estiver online.',
          );
        } else {
          Alert.alert(
            'Erro no Upload',
            error?.message ||
              'Não foi possível enviar a imagem. Verifique sua conexão e tente novamente.',
          );
        }
      } catch (error) {
        logger.error('Erro no upload de avatar:', error);
        Alert.alert('Erro Inesperado', 'Ocorreu um erro ao processar sua imagem. Tente novamente.');
      } finally {
        clearSelectedImage();
        setIsUploading(false);
      }
    };

    uploadAvatar();
  }, [selectedImage, user?.id, clearSelectedImage]);
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ],
      { cancelable: true },
    );
  }, [logout]);
  const handleNavigateToChangePassword = useCallback(
    () => navigateToChangePassword(),
    [navigateToChangePassword],
  );
  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!user?.id) return;

            Alert.alert(
              'Confirmação Final',
              'Digite "EXCLUIR" para confirmar a exclusão da sua conta:',
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Continuar',
                  onPress: () => {
                    Alert.prompt(
                      'Confirmar Exclusão',
                      'Digite "EXCLUIR" para confirmar:',
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Excluir Conta',
                          style: 'destructive',
                          onPress: async text => {
                            if (text === 'EXCLUIR') {
                              setLoading(true);
                              const { success, error } = await profileService.deleteAccount(
                                user.id,
                              );
                              setLoading(false);

                              if (success) {
                                Alert.alert(
                                  'Conta Excluída',
                                  'Sua conta foi excluída com sucesso. Você será desconectado agora.',
                                  [{ text: 'OK', onPress: logout }],
                                );
                              } else {
                                Alert.alert(
                                  'Erro ao Excluir Conta',
                                  error ||
                                    'Não foi possível excluir sua conta. Tente novamente mais tarde.',
                                );
                              }
                            } else {
                              Alert.alert(
                                'Confirmação Incorreta',
                                'Você deve digitar "EXCLUIR" para confirmar a exclusão da conta.',
                              );
                            }
                          },
                        },
                      ],
                      'plain-text',
                    );
                  },
                },
              ],
            );
          },
        },
      ],
      { cancelable: true },
    );
  }, [user?.id, logout]);
  const handleSaveName = useCallback(async () => {
    if (!user?.id || !profile) return;

    const trimmedName = editingFullName.trim();

    if (trimmedName.length > 0 && trimmedName.length < 2) {
      Alert.alert('Nome Inválido', 'O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    if (trimmedName.length > 100) {
      Alert.alert('Nome Muito Longo', 'O nome deve ter no máximo 100 caracteres.');
      return;
    }

    if (trimmedName === (profile.full_name || '')) {
      setIsEditingName(false);
      return;
    }

    setIsSavingName(true);
    const { data, error } = await profileService.updateProfile(user.id, {
      full_name: trimmedName || null,
    });
    setIsSavingName(false);

    if (data) {
      setProfile(data);
    } else if (error?.code === 'OFFLINE') {
      setProfile(prev => (prev ? { ...prev, full_name: trimmedName || null } : prev));
    } else {
      Alert.alert(
        'Erro ao Atualizar Nome',
        'Não foi possível salvar as alterações. Tente novamente.',
      );
      setEditingFullName(profile.full_name || '');
    }

    setIsEditingName(false);
  }, [user?.id, profile, editingFullName]);
  const toggleNameEdit = useCallback(() => setIsEditingName(prev => !prev), []);
  const refreshStats = useCallback(async () => {
    if (user?.id) {
      try {
        const hivesResult = await serviceRegistry
          .getHiveService()
          .fetchHivesByUserId(user.id, 'Todas');
        const hivesCount = hivesResult.data?.length || 0;

        const actionsResult = await serviceRegistry.getActionService().fetchActionHistory();
        const actionsCount = actionsResult.data?.length || 0;

        const createdAt = new Date(user.created_at || Date.now());
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();
        const daysActive = Math.floor(timeDiff / (1000 * 3600 * 24));

        setUserStats({
          hivesCount,
          actionsCount,
          daysActive: Math.max(0, daysActive),
        });
      } catch (error) {
        logger.error('Erro ao atualizar estatísticas:', error);
      }
    }
  }, [user?.id, user?.created_at]);
  const handleRemoveAvatar = useCallback(async () => {
    if (!user?.id || !profile?.avatar_url) return;

    Alert.alert('Remover Foto', 'Tem certeza que deseja remover sua foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          setIsUploading(true);
          const { data, error } = await profileService.updateProfile(user.id, { avatar_url: null });
          setIsUploading(false);

          if (data) {
            setProfile(data);
          } else if (error?.code === 'OFFLINE') {
            setProfile(prev => (prev ? { ...prev, avatar_url: null } : prev));
          } else {
            AlertService.showError('Não foi possível remover sua foto de perfil. Tente novamente.');
          }
        },
      },
    ]);
  }, [user?.id, profile?.avatar_url]);
  const showImagePickerOptions = useCallback(() => {
    const options = ['Escolher da Galeria', 'Tirar Foto'];

    if (profile?.avatar_url) {
      options.push('Remover Foto Atual');
    }

    options.push('Cancelar');

    Alert.alert('Foto de Perfil', 'Escolha uma opção:', [
      {
        text: 'Escolher da Galeria',
        onPress: pickImageFromGallery,
      },
      {
        text: 'Tirar Foto',
        onPress: takePhotoWithCamera,
      },
      ...(profile?.avatar_url
        ? [
            {
              text: 'Remover Foto Atual',
              style: 'destructive' as const,
              onPress: handleRemoveAvatar,
            },
          ]
        : []),
      {
        text: 'Cancelar',
        style: 'cancel' as const,
      },
    ]);
  }, [profile?.avatar_url, handleRemoveAvatar, pickImageFromGallery, takePhotoWithCamera]);
  return {
    user,
    profile,
    loading,
    isUploading,
    isEditingName,
    editingFullName,
    setEditingFullName,
    showImagePickerOptions,
    handleLogout,
    handleNavigateToChangePassword,
    handleDeleteAccount,
    handleSaveName,
    toggleNameEdit,
    isSavingName,
    handleRemoveAvatar,
    userStats,
    refreshStats,
  };
};
