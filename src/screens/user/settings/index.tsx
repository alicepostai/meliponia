import React, { ReactNode, memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import ScreenWrapper from '@/components/ui/screen-wrapper';
import DataSection from '@/components/ui/data-section';
import ThemeSwitch from '@/components/forms/theme-switch';
import { metrics } from '@/theme/metrics';
import { useSettingsActionRowStyles } from './styles';
import { useAppSettings } from './UseAppSettings';
const SettingsActionRow = memo(
  ({
    icon,
    label,
    onPress,
    value,
    isLast = false,
    hideChevron = false,
  }: {
    icon?: string;
    label: string;
    onPress?: () => void;
    value?: string | ReactNode;
    isLast?: boolean;
    hideChevron?: boolean;
  }) => {
    const styles = useSettingsActionRowStyles();
    const { colors } = useTheme();
    return (
      <TouchableOpacity
        style={[styles.actionRow, isLast && styles.actionRowLast]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress}
      >
        <View style={styles.actionIconContainer}>
          {icon && (
            <MaterialCommunityIcons name={icon} size={metrics.iconSizeMedium} color={colors.text} />
          )}
        </View>
        <Text style={styles.actionText}>{label}</Text>
        {typeof value === 'string' ? (
          <Text style={styles.actionValueText}>{value}</Text>
        ) : (
          <View>{value}</View>
        )}
        {onPress && !hideChevron && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={metrics.iconSizeMedium}
            color={colors.secondary}
          />
        )}
      </TouchableOpacity>
    );
  },
);
const AppSettingsScreen = memo(() => {
  const { isDarkMode, appVersion, toggleTheme, openLink, resetTutorial } = useAppSettings();
  const { colors } = useTheme();
  const styles = useSettingsActionRowStyles();

  return (
    <ScreenWrapper scrollable>
      <DataSection title="Aparência">
        <View style={styles.themeOptionContainer}>
          <View style={styles.themeIconContainer}>
            <MaterialCommunityIcons
              name={isDarkMode ? 'weather-night' : 'weather-sunny'}
              size={24}
              color={colors.secondary}
            />
          </View>
          <View style={styles.themeTextContainer}>
            <Text style={styles.themeLabel}>Modo Claro/Escuro</Text>
            <Text style={styles.themeDescription}>
              {isDarkMode ? 'Modo escuro ativado' : 'Modo claro ativado'}
            </Text>
          </View>
          <ThemeSwitch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
      </DataSection>

      <DataSection title="Suporte & Feedback">
        <SettingsActionRow
          icon="school-outline"
          label="Reiniciar Tutorial"
          onPress={resetTutorial}
        />
        <SettingsActionRow
          icon="bug-outline"
          label="Reportar um Problema"
          onPress={() =>
            openLink('mailto:suporte.meliponia@gmail.com?subject=Reportar Problema - Meliponia App')
          }
        />
        <SettingsActionRow
          icon="lightbulb-on-outline"
          label="Sugerir uma Melhoria"
          onPress={() =>
            openLink('mailto:suporte.meliponia@gmail.com?subject=Sugestão - Meliponia App')
          }
          isLast
        />
      </DataSection>
      <DataSection title="Legal">
        <SettingsActionRow
          icon="file-document-outline"
          label="Termos de Serviço"
          onPress={() => openLink('https://exemplo.com/termos')}
        />
        <SettingsActionRow
          icon="shield-lock-outline"
          label="Política de Privacidade"
          onPress={() => openLink('https://exemplo.com/privacidade')}
          isLast
        />
      </DataSection>
      <DataSection title="Sobre">
        <SettingsActionRow
          icon="information-outline"
          label="Versão do Aplicativo"
          value={appVersion}
          isLast
          hideChevron
        />
      </DataSection>
    </ScreenWrapper>
  );
});

SettingsActionRow.displayName = 'SettingsActionRow';
AppSettingsScreen.displayName = 'AppSettingsScreen';

export default AppSettingsScreen;
