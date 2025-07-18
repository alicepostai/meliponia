import React, { memo, useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { usePermissions } from '@/hooks/UsePermissions';
import { useTheme } from '@/contexts/ThemeContext';
import MainButton from '@/components/buttons/main-button';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface PermissionRequestModalProps {
  isVisible: boolean;
  onComplete: () => void;
}

const PermissionRequestModal = memo(({ isVisible, onComplete }: PermissionRequestModalProps) => {
  const { colors } = useTheme();
  const { status, requestAllPermissions } = usePermissions();
  const [hasRequested, setHasRequested] = useState(false);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      backgroundColor: colors.cardBackground,
      margin: metrics.xl,
      borderRadius: metrics.borderRadiusMedium,
      padding: metrics.xl,
      alignItems: 'center',
      maxWidth: 400,
    },
    icon: {
      marginBottom: metrics.lg,
    },
    title: {
      fontSize: fontSizes.xl,
      fontFamily: fonts.SemiBold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: metrics.md,
    },
    description: {
      fontSize: fontSizes.md,
      fontFamily: fonts.Regular,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: metrics.lg,
      lineHeight: fontSizes.md * 1.4,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: metrics.sm,
      paddingHorizontal: metrics.md,
    },
    permissionText: {
      fontSize: fontSizes.md,
      fontFamily: fonts.Regular,
      color: colors.text,
      marginLeft: metrics.md,
      flex: 1,
    },
    permissionIcon: {
      marginRight: metrics.sm,
    },
    buttonContainer: {
      width: '100%',
      marginTop: metrics.lg,
    },
    skipButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: metrics.md,
    },
    skipButtonText: {
      color: colors.textSecondary,
    },
  });

  const handleRequestPermissions = async () => {
    setHasRequested(true);
    await requestAllPermissions();
  };

  useEffect(() => {
    if (hasRequested && status.allGranted) {
      onComplete();
    }
  }, [hasRequested, status.allGranted, onComplete]);

  const permissions = [
    {
      icon: 'camera',
      text: 'Câmera - para escanear QR codes',
      granted: status.camera,
    },
    {
      icon: 'map-marker',
      text: 'Localização - para marcar posição das colmeias',
      granted: status.location,
    },
  ];

  return (
    <Modal visible={isVisible} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="shield-check"
            size={60}
            color={colors.honey}
            style={styles.icon}
          />

          <Text style={styles.title}>Permissões Necessárias</Text>

          <Text style={styles.description}>
            Para usar o Meliponia completamente, precisamos de algumas permissões:
          </Text>

          {permissions.map((permission, index) => (
            <View key={index} style={styles.permissionItem}>
              <MaterialCommunityIcons
                name={permission.icon}
                size={24}
                color={permission.granted ? colors.success : colors.textSecondary}
                style={styles.permissionIcon}
              />
              <Text style={styles.permissionText}>{permission.text}</Text>
              {permission.granted && (
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
              )}
            </View>
          ))}

          <View style={styles.buttonContainer}>
            <MainButton
              title={hasRequested ? 'Verificando...' : 'Conceder Permissões'}
              onPress={handleRequestPermissions}
              loading={status.loading}
              disabled={status.loading}
            />

            <MainButton
              title="Usar Sem Permissões"
              onPress={onComplete}
              style={styles.skipButton}
              textStyle={styles.skipButtonText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
});

PermissionRequestModal.displayName = 'PermissionRequestModal';

export default PermissionRequestModal;
