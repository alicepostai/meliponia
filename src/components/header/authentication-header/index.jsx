import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from './styles';

const AuthHeader = ({title, subtitle, logo}) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default AuthHeader;
