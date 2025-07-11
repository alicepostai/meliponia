import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { fonts } from '@/theme/fonts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  position: 'top' | 'bottom' | 'center';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  visible,
  onComplete,
  onSkip,
}) => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [overlayOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, overlayOpacity, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(0);
      onComplete();
    });
  };

  const handleSkip = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(0);
      onSkip();
    });
  };

  if (!visible || steps.length === 0) {
    return null;
  }

  const currentStepData = steps[currentStep];

  const renderHighlight = () => {
    if (!currentStepData.target) return null;

    const { x, y, width, height } = currentStepData.target;
    const padding = 8;

    console.log('🎯 Renderizando highlight para step:', currentStep + 1);
    console.log('📍 Coordenadas originais:', { x, y, width, height });
    console.log('📱 Dimensões da tela:', { screenWidth, screenHeight });
    console.log('🎯 Posição relativa na tela:', {
      'X (% da largura)': ((x / screenWidth) * 100).toFixed(1) + '%',
      'Y (% da altura)': ((y / screenHeight) * 100).toFixed(1) + '%',
    });

    const isCircular = width <= 60 && height <= 60 && Math.abs(width - height) <= 10;
    const radius = isCircular ? Math.max(width, height) / 2 + padding : 12;

    console.log('🔵 Tipo de elemento:', isCircular ? 'CIRCULAR' : 'RETANGULAR');
    console.log('📏 Raio calculado:', radius);

    return (
      <>
        <View
          style={[
            styles.highlight,
            {
              left: x - padding,
              top: y - padding,
              width: width + padding * 2,
              height: height + padding * 2,
              borderColor: colors.honey,
              borderWidth: 3,
              borderRadius: radius,
              shadowColor: colors.honey,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.pulse,
            {
              left: x - padding - 8,
              top: y - padding - 8,
              width: width + padding * 2 + 16,
              height: height + padding * 2 + 16,
              borderColor: colors.honey,
              borderRadius: radius + 8,
              opacity: overlayOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
            },
          ]}
        />
      </>
    );
  };

  const renderConnectorLine = () => {
    if (!currentStepData.target) return null;

    const { x, y, width, height } = currentStepData.target;
    const tooltipPosition = getTooltipPosition();

    const targetCenterX = x + width / 2;

    let tooltipConnectorY;
    let lineFromY, lineToY;

    if (currentStepData.position === 'top' || y > screenHeight - 200) {
      tooltipConnectorY = tooltipPosition.top + 180;
      lineFromY = tooltipConnectorY;
      lineToY = y - 8;
    } else {
      tooltipConnectorY = tooltipPosition.top;
      lineFromY = y + height + 8;
      lineToY = tooltipConnectorY;
    }

    const lineHeight = Math.abs(lineToY - lineFromY);

    return (
      <Animated.View
        style={[
          styles.connectorLine,
          {
            left: targetCenterX - 1,
            top: Math.min(lineFromY, lineToY),
            height: lineHeight,
            backgroundColor: colors.honey,
            opacity: overlayOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      />
    );
  };

  const getTooltipPosition = () => {
    if (!currentStepData.target) {
      return styles.tooltipCenter;
    }

    const { y, height } = currentStepData.target;
    const tooltipHeight = 200;

    let tooltipStyle;
    if (currentStepData.position === 'top' || y > screenHeight - tooltipHeight) {
      tooltipStyle = {
        ...styles.tooltipTop,
        top: Math.max(50, y - tooltipHeight - 20),
      };
    } else {
      tooltipStyle = {
        ...styles.tooltipBottom,
        top: y + height + 20,
      };
    }

    console.log('📍 Posição do tooltip calculada:', {
      position: currentStepData.position,
      targetY: y,
      targetHeight: height,
      screenHeight,
      tooltipTop: tooltipStyle.top,
    });

    return tooltipStyle;
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <View style={styles.darkOverlay} />

        {renderHighlight()}
        {renderConnectorLine()}

        <View style={[styles.tooltip, getTooltipPosition()]}>
          <View style={styles.tooltipContent}>
            <Text style={[styles.tooltipTitle, { color: colors.text }]}>
              {currentStepData.title}
            </Text>
            <Text style={[styles.tooltipDescription, { color: colors.secondary }]}>
              {currentStepData.description}
            </Text>

            <View style={styles.progressContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: index === currentStep ? colors.honey : colors.border,
                    },
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.skipButton, { borderColor: colors.border }]}
                onPress={handleSkip}
              >
                <Text style={[styles.skipButtonText, { color: colors.secondary }]}>Pular</Text>
              </TouchableOpacity>

              <View style={styles.navigationButtons}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: colors.border }]}
                    onPress={handlePrevious}
                  >
                    <MaterialCommunityIcons name="arrow-left" size={20} color={colors.text} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.nextButton, { backgroundColor: colors.honey }]}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>
                    {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                  </Text>
                  <MaterialCommunityIcons
                    name={currentStep === steps.length - 1 ? 'check' : 'arrow-right'}
                    size={16}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  pulse: {
    position: 'absolute',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  connectorLine: {
    position: 'absolute',
    width: 2,
    borderRadius: 1,
  },
  tooltip: {
    position: 'absolute',
    left: 20,
    right: 20,
    maxWidth: screenWidth - 40,
  },
  tooltipTop: {},
  tooltipBottom: {},
  tooltipCenter: {
    top: screenHeight / 2 - 100,
  },
  tooltipContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tooltipTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    marginBottom: 8,
  },
  tooltipDescription: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 6,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: fonts.Medium,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    marginRight: 8,
  },
});
