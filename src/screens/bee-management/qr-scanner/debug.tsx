import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function DebugQRScannerScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleGoBack = () => {
    console.log('Going back from debug QR scanner');
    router.back();
  };

  const testAlert = () => {
    Alert.alert('Debug', 'QR Scanner debug screen is working!');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Debug QR Scanner',
          headerTintColor: colors.headerText,
        }}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Debug QR Scanner Screen</Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Se você consegue ver esta tela, a navegação está funcionando!
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.honey }]}
          onPress={testAlert}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Teste de Alerta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.error }]}
          onPress={handleGoBack}
        >
          <Text style={[styles.buttonText, { color: colors.white }]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
