import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocationPickerModalStyles } from './styles';
import MainButton from '@/components/buttons/main-button';
import UnifiedMapComponent, {
  BeeMarker,
  UnifiedMapComponentRef,
} from '@/components/maps/UnifiedMapComponent';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
interface LocationPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number }) => void;
  initialCoordinates?: { latitude: number; longitude: number } | null;
}
const BRAZIL_CENTER: Region = {
  latitude: -14.235004,
  longitude: -51.92528,
  latitudeDelta: 45,
  longitudeDelta: 45,
};

const LocationPickerModal = memo(
  ({ isVisible, onClose, onLocationSelect, initialCoordinates }: LocationPickerModalProps) => {
    const { colors: themeColors } = useTheme();
    const styles = useLocationPickerModalStyles();
    const mapRef = useRef<UnifiedMapComponentRef>(null);
    const [selectedLocation, setSelectedLocation] = useState(initialCoordinates);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const initializedRef = useRef(false);

    const animateToRegion = useCallback((coords: { latitude: number; longitude: number }) => {
      setTimeout(() => {
        mapRef.current?.animateToRegion(coords);
      }, 500);
    }, []);

    const handleGoToCurrentUserLocation = useCallback(async () => {
      setIsLoadingLocation(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Negada',
            'Permissão de localização é necessária para esta funcionalidade.',
          );
          return;
        }
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setSelectedLocation(coords);
        animateToRegion(coords);
      } catch (error) {
        console.error('LocationPickerModal: Erro ao obter localização', error);
        Alert.alert('Erro', 'Não foi possível obter sua localização atual.');
      } finally {
        setIsLoadingLocation(false);
      }
    }, [animateToRegion]);

    useEffect(() => {
      if (isVisible) {
        if (!initializedRef.current) {
          initializedRef.current = true;
          if (initialCoordinates) {
            setSelectedLocation(initialCoordinates);
            animateToRegion(initialCoordinates);
          } else {
            setSelectedLocation(null);
          }
        }
      } else {
        initializedRef.current = false;
      }
    }, [isVisible, initialCoordinates, animateToRegion]);

    const handleMapPress = useCallback((coordinate: { latitude: number; longitude: number }) => {
      console.log('LocationPickerModal: Map pressed with coordinate:', coordinate);
      setSelectedLocation(coordinate);
    }, []);

    const handleConfirmLocation = useCallback(() => {
      console.log('LocationPickerModal: Confirming location:', selectedLocation);
      if (selectedLocation) {
        console.log('LocationPickerModal: Calling onLocationSelect with:', selectedLocation);
        onLocationSelect(selectedLocation);
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        Alert.alert(
          'Nenhum Local Selecionado',
          'Por favor, toque no mapa para selecionar um local.',
        );
      }
    }, [selectedLocation, onLocationSelect, onClose]);

    return (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
        style={styles.modalContainer}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        useNativeDriverForBackdrop
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Selecionar Localização</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={26} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.instructionsText}>
            Mova o mapa e toque para definir o local, ou use sua localização atual.
          </Text>
          <View style={styles.mapContainer}>
            <UnifiedMapComponent
              ref={mapRef}
              style={styles.map}
              initialRegion={
                initialCoordinates
                  ? { ...initialCoordinates, latitudeDelta: 0.01, longitudeDelta: 0.01 }
                  : BRAZIL_CENTER
              }
              onMapPress={handleMapPress}
              showsUserLocation
            >
              {selectedLocation && (
                <BeeMarker
                  id="selected-location-marker"
                  coordinate={selectedLocation}
                  title="Local Selecionado"
                />
              )}
            </UnifiedMapComponent>
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={handleGoToCurrentUserLocation}
            >
              <MaterialCommunityIcons name="crosshairs-gps" size={24} color={themeColors.primary} />
            </TouchableOpacity>
            {isLoadingLocation && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={themeColors.honey} />
              </View>
            )}
          </View>
          <MainButton
            title="Confirmar Localização"
            onPress={handleConfirmLocation}
            disabled={!selectedLocation || isLoadingLocation}
          />
        </View>
      </Modal>
    );
  },
);

LocationPickerModal.displayName = 'LocationPickerModal';

export default LocationPickerModal;
