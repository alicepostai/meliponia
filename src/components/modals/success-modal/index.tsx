import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onDismiss: () => void;
  showIcon?: boolean;
  actionText?: string;
  onAction?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title = 'Sucesso!',
  message,
  onDismiss,
  showIcon = true,
  actionText = 'Entendi',
  onAction,
}) => {
  const { colors } = useTheme();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 20,
            paddingTop: 32,
            paddingBottom: 24,
            paddingHorizontal: 24,
            maxWidth: Math.min(screenWidth - 48, 380),
            width: '100%',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
            borderWidth: 1,
            borderColor: colors.success + '10',
          }}
        >
          {showIcon && (
            <View
              style={{
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.success + '10',
                  borderRadius: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: colors.success + '15',
                    borderRadius: 28,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: colors.success + '30',
                  }}
                >
                  <MaterialCommunityIcons name="bee" size={28} color={colors.success} />
                </View>
              </View>
            </View>
          )}

          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 8,
              fontFamily: 'Poppins-Bold',
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: 28,
              fontFamily: 'Poppins-Regular',
            }}
          >
            {message}
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: colors.honey,
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: colors.honey,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleAction}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'Poppins-SemiBold',
              }}
            >
              {actionText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
