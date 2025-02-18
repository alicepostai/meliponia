import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {supabase} from '../../../services/supabase';
import {colors} from '../../../utils/Colors';
import InputField from '../../../components/forms/input-field';
import Button from '../../../components/buttons/main-button';
import AuthFooter from '../../../components/footer/auth-footer';
import AuthHeader from '../../../components/header/authentication-header';
import styles from './styles';

const Login = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);

  const handleSignup = () =>
    navigation.navigate('authentication', {screen: 'signUp'});
  const handleForgotPassword = () =>
    navigation.navigate('authentication', {screen: 'passwordRecovery'});

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Insira um e-mail válido')
      .required('E-mail é obrigatório'),
    password: Yup.string()
      .min(6, 'A senha deve ter pelo menos 6 caracteres')
      .required('Senha é obrigatória'),
  });

  const handleLogin = async values => {
    const {email, password} = values;
    const {error} = await supabase.auth.signInWithPassword({email, password});

    if (error) {
      alert(error.message);
    } else {
      navigation.navigate('bottomTab', {screen: 'hiveList'});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <AuthHeader
        title="Boas vindas ao Meliponia!"
        logo={require('../../../../assets/homeImage.jpg')}
      />

      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
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

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button title="Login" onPress={handleSubmit} />

            <AuthFooter
              text="Não possui uma conta?"
              actionText="Cadastre-se"
              onPress={handleSignup}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Login;
