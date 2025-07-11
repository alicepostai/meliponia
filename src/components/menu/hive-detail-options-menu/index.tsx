import React, { memo, useCallback } from 'react';
import { Modal, View, Text, Pressable, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useSimpleOptionsMenuStyles } from './styles';
interface OptionItem {
  label: string;
  icon?: string;
  onPress: () => void;
  isDestructive?: boolean;
}
interface MenuItemProps {
  option: OptionItem;
  onPress: () => void;
}
const MenuItem = memo(({ option, onPress }: MenuItemProps) => {
  const styles = useSimpleOptionsMenuStyles();
  const { colors } = useTheme();
  const iconColor = option.isDestructive ? colors.error : colors.text;
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      {option.icon && (
        <MaterialCommunityIcons
          name={option.icon}
          size={20}
          color={iconColor}
          style={styles.menuIcon}
        />
      )}
      <Text style={[styles.menuText, option.isDestructive && styles.destructiveText]}>
        {option.label}
      </Text>
    </Pressable>
  );
});

MenuItem.displayName = 'MenuItem';

interface SimpleOptionsMenuProps {
  isVisible: boolean;
  onDismiss: () => void;
  options: OptionItem[];
}
const SimpleOptionsMenu = memo(({ isVisible, onDismiss, options }: SimpleOptionsMenuProps) => {
  const styles = useSimpleOptionsMenuStyles();

  const handleItemPress = useCallback(
    (itemOnPress: () => void) => {
      itemOnPress();
      onDismiss();
    },
    [onDismiss],
  );

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={onDismiss}
      animationType="none"
      statusBarTranslucent
      hardwareAccelerated
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {options.map((option, index) => (
                <MenuItem
                  key={`${option.label}-${index}`}
                  option={option}
                  onPress={() => handleItemPress(option.onPress)}
                />
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

SimpleOptionsMenu.displayName = 'SimpleOptionsMenu';

export default SimpleOptionsMenu;
