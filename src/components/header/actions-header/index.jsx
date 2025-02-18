import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../utils/Colors';
import styles from './styles';

const ActionHeader = ({
  iconName,
  iconSize = 30,
  iconColor = colors.honey,
  title,
  subtitle,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={styles.headerContainer}>
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={[styles.headingText, titleStyle]}>{title}</Text>
      <Text style={[styles.subtitleText, subtitleStyle]}>{subtitle}</Text>
    </View>
  );
};

export default ActionHeader;
