import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/theme/commonStyles';
interface QRTransferModalProps {
  visible: boolean;
  transactionType: 'Venda' | 'Doação';
  recipient: string;
  onGenerateQR: () => void;
  onSkip: () => void;
}

export const QRTransferModal: React.FC<QRTransferModalProps> = ({
  visible,
  transactionType,
  recipient,
  onGenerateQR,
  onSkip,
}) => {
  const { colors } = useTheme();
  const commonStyles = createCommonStyles(colors);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContent}>
          <MaterialCommunityIcons
            name="qrcode"
            size={60}
            color={colors.honey}
            style={{ alignSelf: 'center', marginBottom: 16 }}
          />
          <Text style={commonStyles.modalTitle}>Transferir Colmeia?</Text>
          <Text style={commonStyles.modalMessage}>
            Sua {transactionType.toLowerCase()} para {recipient} foi registrada com sucesso!
          </Text>
          <Text style={[commonStyles.modalMessage, { marginTop: 8 }]}>
            Deseja gerar um QR-code para transferir a colmeia e seu histórico diretamente para o
            novo proprietário?
          </Text>
          <View style={commonStyles.modalButtonContainer}>
            <TouchableOpacity
              style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
              onPress={onSkip}
            >
              <Text style={commonStyles.secondaryButtonText}>Não, obrigado</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
              onPress={onGenerateQR}
            >
              <Text style={commonStyles.primaryButtonText}>Gerar QR-Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
