import React, { memo } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { createCommonStyles } from '@/theme/commonStyles';
export type FeedbackType = 'loading' | 'error' | 'empty';
interface FeedbackStateProps {
  type: FeedbackType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  icon?: string;
  children?: React.ReactNode;
}

export const FeedbackState = memo<FeedbackStateProps>(
  ({ type, title, message, onRetry, retryButtonText = 'Tentar Novamente', icon, children }) => {
    const { colors } = useTheme();
    const commonStyles = createCommonStyles(colors);
    const getDefaultIcon = () => {
      switch (type) {
        case 'loading':
          return null;
        case 'error':
          return 'alert-circle-outline';
        case 'empty':
          return 'inbox-outline';
        default:
          return 'information-outline';
      }
    };
    const getDefaultTitle = () => {
      switch (type) {
        case 'loading':
          return 'Carregando...';
        case 'error':
          return 'Ops! Algo deu errado';
        case 'empty':
          return 'Nenhum item encontrado';
        default:
          return '';
      }
    };
    const getDefaultMessage = () => {
      switch (type) {
        case 'loading':
          return 'Aguarde um momento';
        case 'error':
          return 'Ocorreu um erro inesperado. Tente novamente.';
        case 'empty':
          return 'Não há dados para exibir no momento.';
        default:
          return '';
      }
    };
    const finalTitle = title || getDefaultTitle();
    const finalMessage = message || getDefaultMessage();
    const finalIcon = icon || getDefaultIcon();
    return (
      <View style={commonStyles.feedbackContainer}>
        {type === 'loading' ? (
          <ActivityIndicator size="large" color={colors.honey} />
        ) : finalIcon ? (
          <MaterialCommunityIcons
            name={finalIcon}
            size={60}
            color={type === 'error' ? colors.error : colors.textSecondary}
            style={{ marginBottom: 16 }}
          />
        ) : null}
        {finalTitle && (
          <Text
            style={[
              commonStyles.feedbackText,
              {
                fontSize: 18,
                fontWeight: '600',
                marginTop: type === 'loading' ? 16 : 0,
                marginBottom: finalMessage ? 8 : 0,
                color: type === 'error' ? colors.error : colors.text,
              },
            ]}
          >
            {finalTitle}
          </Text>
        )}
        {finalMessage && (
          <Text
            style={[
              commonStyles.feedbackText,
              {
                marginTop: 0,
                color: colors.textSecondary,
              },
            ]}
          >
            {finalMessage}
          </Text>
        )}
        {children}
        {onRetry && type !== 'loading' && (
          <TouchableOpacity
            style={[commonStyles.retryButton, { marginTop: 24 }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="reload"
              size={18}
              color={colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={commonStyles.retryButtonText}>{retryButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);
FeedbackState.displayName = 'FeedbackState';
