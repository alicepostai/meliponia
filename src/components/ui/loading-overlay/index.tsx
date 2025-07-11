import React, { memo } from 'react';
import { View, ActivityIndicator, Modal, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoadingOverlayStyles } from './styles';
interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
}
const LoadingOverlay = memo(({ visible, text = 'Carregando...' }: LoadingOverlayProps) => {
  const { colors } = useTheme();
  const styles = useLoadingOverlayStyles();
  return (
    <Modal transparent={true} animationType="none" visible={visible} onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={colors.honey} />
          {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
});
export default LoadingOverlay;
