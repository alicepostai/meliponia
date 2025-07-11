import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts, fontSizes } from '@/theme/fonts';
import { metrics } from '@/theme/metrics';
import MainButton from '@/components/buttons/main-button';
import { AppColorPalette } from '@/theme/colors';

export default function NotFoundScreen() {
  const { colors: themeColors } = useTheme();
  const styles = notFoundScreenStyles(themeColors);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Página Não Encontrada',
          headerStyle: { backgroundColor: themeColors.headerBackground },
          headerTintColor: themeColors.headerText,
          headerTitleStyle: { color: themeColors.headerText, fontFamily: fonts.SemiBold },
        }}
      />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel="Ilustração de abelha"
        />

        <Text style={styles.title}>Oops! Algo deu errado...</Text>
        <Text style={styles.message}>
          A página que você está procurando não existe ou foi movida. Que tal voltar para o início e
          tentar novamente?
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/(app)/(tabs)" asChild replace>
            <MainButton title="Voltar para o Início" onPress={() => {}} />
          </Link>
        </View>
      </View>
    </>
  );
}

const notFoundScreenStyles = (themeColors: AppColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: metrics.xl,
      backgroundColor: themeColors.background,
    },
    image: {
      width: 120,
      height: 120,
      marginBottom: metrics['2xl'],
    },
    title: {
      fontSize: fontSizes['3xl'],
      fontFamily: fonts.Bold,
      color: themeColors.text,
      marginBottom: metrics.md,
      textAlign: 'center',
    },
    message: {
      fontSize: fontSizes.lg,
      fontFamily: fonts.Regular,
      color: themeColors.textSecondary,
      textAlign: 'center',
      marginBottom: metrics.xl,
      lineHeight: fontSizes.lg * 1.5,
    },
    buttonContainer: {
      width: '80%',
      maxWidth: 300,
      marginTop: metrics.lg,
    },
  });
