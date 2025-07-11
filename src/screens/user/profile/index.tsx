import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DataSection from '@/components/ui/data-section';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { useProfileScreenStyles, useActionRowStyles } from './styles';
import { useProfileScreen } from './UseProfileScreen';
const ActionRow = memo(
  ({
    icon,
    label,
    onPress,
    isDestructive = false,
    isFirst = false,
    isLast = false,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
  }) => {
    const styles = useActionRowStyles();
    const { colors } = useTheme();
    return (
      <TouchableOpacity
        style={[styles.actionRow, isFirst && styles.actionRowFirst, isLast && styles.actionRowLast]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={isDestructive ? colors.error : colors.text}
          style={styles.actionIcon}
        />
        <Text style={[styles.actionText, isDestructive && styles.destructiveText]}>{label}</Text>
        {!isDestructive && (
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.secondary} />
        )}
      </TouchableOpacity>
    );
  },
);
ActionRow.displayName = 'ActionRow';
const ProfileScreen = memo(() => {
  const styles = useProfileScreenStyles();
  const { colors } = useTheme();
  const {
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
    userStats,
  } = useProfileScreen();
  if (loading) {
    return (
      <ScreenWrapper style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.honey} />
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper scrollable>
      <View style={styles.userInfoContainer}>
        <TouchableOpacity
          onPress={showImagePickerOptions}
          style={styles.avatarContainer}
          disabled={isUploading}
        >
          <View style={styles.avatarPlaceholder}>
            {isUploading ? (
              <ActivityIndicator color={colors.primary} />
            ) : profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={60}
                color={colors.primary}
              />
            )}
          </View>
          {!isUploading && (
            <View style={styles.editAvatarButton}>
              <MaterialCommunityIcons name="camera-plus-outline" size={18} color={colors.white} />
            </View>
          )}
        </TouchableOpacity>
        {isEditingName ? (
          <View style={styles.nameContainer}>
            <TextInput
              style={styles.nameInput}
              value={editingFullName}
              onChangeText={setEditingFullName}
              autoFocus
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
              placeholder="Como deseja ser chamado?"
              placeholderTextColor={colors.secondary}
            />
            <TouchableOpacity
              onPress={handleSaveName}
              style={styles.saveNameButton}
              disabled={isSavingName}
            >
              {isSavingName ? (
                <ActivityIndicator size={20} color={colors.white} />
              ) : (
                <MaterialCommunityIcons name="check" size={20} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nameContainer}>
            <Text style={styles.nameText} onPress={toggleNameEdit}>
              {profile?.full_name || 'Adicionar Nome'}
            </Text>
            <TouchableOpacity onPress={toggleNameEdit} style={styles.editNameButton}>
              <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.emailText}>{user?.email ?? 'Carregando...'}</Text>

        {profile?.updated_at && (
          <Text style={styles.lastUpdateText}>
            Último acesso: {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
          </Text>
        )}
      </View>

      <DataSection title="Estatísticas" style={styles.sectionSpacing}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.hivesCount}</Text>
            <Text style={styles.statLabel}>Colmeias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.actionsCount}</Text>
            <Text style={styles.statLabel}>Ações</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.daysActive}</Text>
            <Text style={styles.statLabel}>Dias Ativo</Text>
          </View>
        </View>
      </DataSection>

      <DataSection title="Gerenciamento da Conta" style={styles.sectionSpacing}>
        <ActionRow
          icon="lock-reset"
          label="Alterar Senha"
          onPress={handleNavigateToChangePassword}
          isFirst
        />
        <ActionRow icon="logout-variant" label="Sair da Conta" onPress={handleLogout} isLast />
      </DataSection>

      <DataSection title="Exclusão de Conta" style={styles.sectionSpacing}>
        <ActionRow
          icon="account-remove-outline"
          label="Excluir Conta"
          onPress={handleDeleteAccount}
          isDestructive
          isFirst
          isLast
        />
      </DataSection>
      <View style={{ height: metrics.xl }} />
    </ScreenWrapper>
  );
});
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
