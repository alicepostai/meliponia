import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { onboardingService } from '@/services/OnboardingService';
import { fonts } from '@/theme/fonts';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Boas Vindas ao Meliponia!',
    description:
      'O app completo para gerenciar suas colmeias de abelhas sem ferrão. Registre, monitore e acompanhe suas abelhas de forma simples e eficiente.',
    icon: 'bee',
    backgroundColor: '#F2A65A',
  },
  {
    id: '2',
    title: 'Registre suas Colmeias',
    description:
      'Cadastre suas colmeias com fotos, localização, espécie da abelha e todas as informações importantes. Mantenha tudo organizado em um só lugar.',
    icon: 'beehive-outline',
    backgroundColor: '#6C5CE7',
  },
  {
    id: '3',
    title: 'Monitore suas Ações ',
    description:
      'Registre inspeções, alimentação, divisões, colheitas e manutenções. Acompanhe o histórico completo de cada colmeia.',
    icon: 'clipboard-list-outline',
    backgroundColor: '#00B894',
  },
  {
    id: '4',
    title: 'Use QR Codes',
    description:
      'Gere QR codes únicos para suas colmeias e transfira dados facilmente. Perfeito para compartilhar informações com outros apicultores.',
    icon: 'qrcode',
    backgroundColor: '#E17055',
  },
  {
    id: '5',
    title: 'Visualize no Mapa',
    description:
      'Veja todas suas colmeias em um mapa interativo. Encontre rapidamente a localização de cada uma e organize seu apiário.',
    icon: 'map-marker-multiple',
    backgroundColor: '#0984E3',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleSkip = async () => {
    await onboardingService.markOnboardingComplete();
    router.replace('/(app)/(tabs)');
  };

  const handleFinish = async () => {
    try {
      await onboardingService.markOnboardingComplete();
      await onboardingService.resetTutorial();
      router.replace('/(app)/(tabs)');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      router.replace('/(app)/(tabs)');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={item.icon} size={120} color="white" />
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPaginationDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingSlides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
        keyExtractor={item => item.id}
      />
      <View style={styles.bottomSection}>
        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => renderPaginationDot(index))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingSlides.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <MaterialCommunityIcons
            name={currentIndex === onboardingSlides.length - 1 ? 'check' : 'arrow-right'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2A65A',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.Medium,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 60,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: fonts.Regular,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    marginRight: 8,
  },
});
