import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { View, Pressable, Text, Animated, Easing, StyleProp, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { useFabWithOptionsStyles, useFabOptionItemStyles } from './styles';
export interface FabOption {
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
  labelColor?: string;
}
interface FabOptionItemProps {
  option: FabOption;
  onPress: (callback: () => void) => void;
}
const FabOptionItem = memo(({ option, onPress }: FabOptionItemProps) => {
  const { colors: themeColors } = useTheme();
  const styles = useFabOptionItemStyles();
  return (
    <View style={styles.optionRow}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{option.label}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          { backgroundColor: option.color || themeColors.honey },
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => onPress(option.onPress)}
      >
        <MaterialCommunityIcons
          name={option.icon}
          size={metrics.iconSizeMedium}
          color={option.labelColor || themeColors.white}
        />
      </Pressable>
    </View>
  );
});

FabOptionItem.displayName = 'FabOptionItem';
interface FabWithOptionsProps {
  options: FabOption[];
  fabIconName?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
const FabWithOptions = memo(
  ({ options, fabIconName = 'plus', containerStyle }: FabWithOptionsProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useFabWithOptionsStyles();
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(animation, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, [isOpen, animation]);
    const toggleMenu = useCallback(() => {
      setIsOpen(prev => !prev);
    }, []);
    const handleOptionPress = useCallback((onPressCallback: () => void) => {
      onPressCallback();
      setIsOpen(false);
    }, []);
    const mainButtonRotate = useMemo(
      () =>
        animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      [animation],
    );
    const optionsContainerStyle = useMemo(
      () => ({
        opacity: animation,
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }),
      [animation],
    );
    return (
      <View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[styles.optionsContainer, optionsContainerStyle]}
          pointerEvents={isOpen ? 'auto' : 'none'}
        >
          {options.map(option => (
            <FabOptionItem key={option.label} option={option} onPress={handleOptionPress} />
          ))}
        </Animated.View>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.8 }]}
          onPress={toggleMenu}
        >
          <Animated.View style={{ transform: [{ rotate: mainButtonRotate }] }}>
            <MaterialCommunityIcons
              name={isOpen ? 'close' : fabIconName}
              size={30}
              color={themeColors.white}
            />
          </Animated.View>
        </Pressable>
      </View>
    );
  },
);

FabWithOptions.displayName = 'FabWithOptions';

export default FabWithOptions;
