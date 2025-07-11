import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFontErrorDisplayStyles } from './styles';
interface FontErrorDisplayProps {
  error: Error;
}
const FontErrorDisplay = memo(({ error }: FontErrorDisplayProps) => {
  const { colors, isDarkMode } = useTheme();
  const styles = useFontErrorDisplayStyles();
  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={colors.background} />
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={60}
        color={colors.error}
        style={styles.icon}
      />
      <Text style={styles.titleText}>Problema com as Fontes</Text>
      <Text style={styles.messageText}>
        Ocorreu um erro ao carregar as fontes necessárias para o aplicativo. Por favor, tente
        reiniciar o aplicativo.
      </Text>
      {error?.message && <Text style={styles.detailText}>Detalhes: {error.message}</Text>}
    </View>
  );
});
export default FontErrorDisplay;
