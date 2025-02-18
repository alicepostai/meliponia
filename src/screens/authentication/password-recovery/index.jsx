import React, {useState} from 'react';
import {View, Text, Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../../services/supabase';
import {colors} from '../../../utils/Colors';
import InputField from '../../../components/forms/input-field';
import Button from '../../../components/buttons/main-button';
import AuthFooter from '../../../components/footer/auth-footer';
import AuthHeader from '../../../components/header/authentication-header';
import styles from './styles';

const PasswordRecovery = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordRecovery = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      Alert.alert(
        'Sucesso',
        'E-mail de recuperação enviado! Verifique sua caixa de entrada.',
      );
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Esqueceu sua senha?"
        subtitle="Insira seu e-mail para recuperar sua senha."
      />

      <View style={styles.formContainer}>
        <InputField
          iconName="email-outline"
          placeholder="Insira seu e-mail"
          placeholderTextColor={colors.secondary}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Button
          title={loading ? 'Enviando...' : 'Enviar e-mail de recuperação'}
          onPress={handlePasswordRecovery}
          loading={loading}
          disabled={loading}
        />
      </View>

      <AuthFooter
        text="Lembrou da senha?"
        actionText="Faça login"
        onPress={() => navigation.navigate('authentication', {screen: 'login'})}
      />
    </View>
  );
};

export default PasswordRecovery;
