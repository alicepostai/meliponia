import React, { useEffect, useRef, memo, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Easing,
  Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { useExpandingFabMenuStyles, useFabOptionItemStyles } from './styles';
export interface ExpandingFabOption {
  label: string;
  icon: string;
  onPress: () => void;
}
interface FabOptionItemProps {
  option: ExpandingFabOption;
  index: number;
  animation: Animated.Value;
  isVisible: boolean;
  onPress: (callback: () => void) => void;
}
const FabOptionItem = memo(
  ({ option, index, animation, isVisible, onPress }: FabOptionItemProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useFabOptionItemStyles();
    const animatedStyle = useMemo(() => {
      const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(index + 1) * 60],
      });
      return {
        opacity: animation,
        transform: [{ translateY }],
      };
    }, [animation, index]);
    return (
      <Animated.View
        key={option.label}
        style={[styles.optionContainer, animatedStyle, !isVisible && styles.hiddenOption]}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{option.label}</Text>
        </View>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: themeColors.cardBackground }]}
          onPress={() => onPress(option.onPress)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={option.icon}
            size={metrics.iconSizeMedium}
            color={themeColors.honey}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

FabOptionItem.displayName = 'FabOptionItem';
interface ExpandingFabMenuProps {
  options: ExpandingFabOption[];
  fabIconName?: string;
  isVisible: boolean;
  toggleMenu: () => void;
}
const ExpandingFabMenu = memo(
  ({ options, fabIconName = 'plus', isVisible, toggleMenu }: ExpandingFabMenuProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useExpandingFabMenuStyles();
    const animation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(animation, {
        toValue: isVisible ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }, [isVisible, animation]);
    const animatedFabStyle = useMemo(
      () => ({
        transform: [
          {
            rotate: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '45deg'],
            }),
          },
        ],
      }),
      [animation],
    );
    const handleOptionPress = useCallback(
      (onPressCallback: () => void) => {
        onPressCallback();
        toggleMenu();
      },
      [toggleMenu],
    );
    return (
      <>
        {isVisible && <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />}
        <View style={styles.container}>
          {options.map((option, index) => (
            <FabOptionItem
              key={option.label}
              option={option}
              index={index}
              animation={animation}
              isVisible={isVisible}
              onPress={handleOptionPress}
            />
          ))}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: themeColors.honey }]}
            onPress={toggleMenu}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedFabStyle}>
              <MaterialCommunityIcons
                name={isVisible ? 'close' : fabIconName}
                size={30}
                color={themeColors.white}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </>
    );
  },
);

ExpandingFabMenu.displayName = 'ExpandingFabMenu';

export default ExpandingFabMenu;
