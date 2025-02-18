import React, {useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {supabase} from '../../../services/supabase';
import {colors} from '../../../utils/Colors';
import InputField from '../../../components/forms/input-field';
import Button from '../../../components/buttons/main-button';
import AuthHeader from '../../../components/header/authentication-header';
import AuthFooter from '../../../components/footer/auth-footer';
import styles from './styles';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);

  const handleLogin = () =>
    navigation.navigate('authentication', {screen: 'login'});

  const handleSignup = async values => {
    const {email, password} = values;

    const {error} = await supabase.auth.signUp({email, password});

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso', 'Cadastro realizado! Verifique seu e-mail.');
      navigation.navigate('authentication', {screen: 'login'});
    }
  };

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email obrigatório'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Senha obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'As senhas devem corresponder')
      .required('Confirmação de senha obrigatória'),
  });

  return (
    <Formik
      initialValues={{email: '', password: '', confirmPassword: ''}}
      validationSchema={SignupSchema}
      onSubmit={handleSignup}>
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.container}>
          <AuthHeader
            title="Faça seu cadastro"
            subtitle="Crie uma conta para começar."
          />

          <View style={styles.formContainer}>
            <InputField
              iconName="email-outline"
              placeholder="Insira seu e-mail"
              placeholderTextColor={colors.secondary}
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <InputField
              iconName="lock-outline"
              placeholder="Insira sua senha"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              toggleSecureEntry={() => setSecureEntry(prev => !prev)}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <InputField
              iconName="lock-outline"
              placeholder="Confirme sua senha"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              toggleSecureEntry={() => setSecureEntry(prev => !prev)}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <Button title="Cadastrar" onPress={handleSubmit} />

            <AuthFooter
              text="Já possui uma conta?"
              actionText="Faça login"
              onPress={handleLogin}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default SignupScreen;
