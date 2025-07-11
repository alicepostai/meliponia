import React, { memo } from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { metrics } from '@/theme/metrics';
import { useHiveDetailHeaderStyles } from './styles';
interface HiveDetailHeaderProps {
  displayImageUri: string | null | undefined;
  speciesName?: string;
  onSelectNewImage: () => void;
  isUploadingImage?: boolean;
  onOpenOptionsMenu?: () => void;
}
const HiveDetailHeader = memo(
  ({
    displayImageUri,
    speciesName,
    onSelectNewImage,
    isUploadingImage = false,
    onOpenOptionsMenu,
  }: HiveDetailHeaderProps) => {
    const { colors } = useTheme();
    const styles = useHiveDetailHeaderStyles();
    return (
      <View style={styles.imageContainer}>
        {displayImageUri ? (
          <Image
            source={{ uri: displayImageUri }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`Imagem da colmeia ${speciesName || ''}`}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="beehive-off-outline" size={60} color={colors.secondary} />
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        {onOpenOptionsMenu && (
          <TouchableOpacity
            style={styles.optionsMenuButtonOverImage}
            onPress={onOpenOptionsMenu}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={metrics.iconSizeLarge}
              color={colors.white}
              style={styles.iconShadow}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={onSelectNewImage}
          disabled={isUploadingImage}
          activeOpacity={0.7}
        >
          {isUploadingImage ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <MaterialCommunityIcons
              name="camera-outline"
              size={metrics.iconSizeLarge - 4}
              color={colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  },
);
export default HiveDetailHeader;
