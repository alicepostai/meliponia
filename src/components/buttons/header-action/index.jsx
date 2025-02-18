import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../utils/Colors';
import Styles from '../../../utils/Styles';

const HeaderActionButton = ({ iconName, accessibilityLabel, screenName }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('mainApp', { screen: screenName });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={Styles.headerButton}
      accessibilityLabel={accessibilityLabel}
    >
      <MaterialCommunityIcons name={iconName} size={24} color={colors.honey} />
    </TouchableOpacity>
  );
};

export default HeaderActionButton;
