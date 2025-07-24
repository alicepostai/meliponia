import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { logger } from '@/utils/logger';
import { AlertService } from '@/services/AlertService';

interface SimpleHeaderButtonProps {
  onPress: () => void;
  color: string;
}

export default function SimpleHeaderButton({ onPress, color }: SimpleHeaderButtonProps) {
  const handlePress = () => {
    logger.debug('SimpleHeaderButton pressed');
    AlertService.showSuccess('Botão funcionando!', {
      title: 'Button Test',
      onAction: onPress
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 5,
        marginRight: 10,
      }}
    >
      <MaterialCommunityIcons name="dots-vertical" size={24} color={color} />
    </TouchableOpacity>
  );
}
