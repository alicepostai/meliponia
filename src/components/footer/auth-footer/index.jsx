import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const AuthFooter = ({text, actionText, onPress}) => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.footerActionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
