import React, { memo, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeSwitchStyles } from './styles';

interface ThemeSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ThemeSwitch = memo<ThemeSwitchProps>(({ value, onValueChange }) => {
  const { colors } = useTheme();
  const styles = useThemeSwitchStyles();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28],
  });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: value ? '#2C3A47' : '#F2A65A',
        },
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconContainer,
          styles.sunIcon,
          {
            opacity: value ? 0.4 : 1,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="weather-sunny"
          size={16}
          color={value ? '#a4b0be' : '#FFFFFF'}
        />
      </View>

      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: colors.white,
            transform: [{ translateX }],
          },
        ]}
      >
        <MaterialCommunityIcons
          name={value ? 'weather-night' : 'weather-sunny'}
          size={14}
          color={value ? '#2C3A47' : '#F2A65A'}
        />
      </Animated.View>

      <View
        style={[
          styles.iconContainer,
          styles.moonIcon,
          {
            opacity: value ? 1 : 0.4,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="weather-night"
          size={16}
          color={value ? '#FFFFFF' : '#a4b0be'}
        />
      </View>
    </TouchableOpacity>
  );
});

ThemeSwitch.displayName = 'ThemeSwitch';
export default ThemeSwitch;
