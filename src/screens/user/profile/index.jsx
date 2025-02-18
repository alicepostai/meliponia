import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../contexts/AuthContext';
import {colors} from '../../../utils/Colors';
import styles from './styles';

const Profile = () => {
  const navigation = useNavigation();

  const {user, logout} = useAuth();

  const handleLogout = async () => {
    await logout();

    navigation.reset({
      index: 0,
      routes: [{name: 'authentication', params: {screen: 'login'}}],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={36}
            color="#aaa"
          />
        </View>
        <Text style={styles.email}>alice.postai.n@gmail.com</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem}>
          <MaterialCommunityIcons
            name="account-lock-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.optionText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color="#d9534f"
          />
          <Text style={styles.optionText}>Excluir Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={24}
            color="#5cb85c"
          />
          <Text style={styles.optionText}>Contatar Suporte</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
