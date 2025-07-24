import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/contexts/ThemeContext';
import { logger } from '@/utils/logger';

const BEE_PIN_BASE64 =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZGF0YS1uYW1lPSJMYXllciAxIiBpZD0iTGF5ZXJfMSIgdmlld0JveD0iMCAwIDI3MiAyNzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiM0MjQyNDI7fS5jbHMtMntmaWxsOiNmZmViM2M7fS5jbHMtM3tmaWxsOiNlMmUzZTU7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZS8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTg0LDE0Mi44YzAsMTkuNzEtOS42LDQzLjYzLTIwLjIxLDY0QTM4Mi42NywzODIuNjcsMCwwLDEsMTM2LDI1MmEzODIuNjcsMzgyLjY3LDAsMCwxLTI3Ljc5LTQ1LjE1Qzk3LjYsMTg2LjQzLDg4LDE2Mi41MSw4OCwxNDIuOGMwLTEsMC0yLDAtM2ExMDIuMzksMTAyLjM5LDAsMCwxLDEuNDYtMTUuNTEsNzMuNjYsNzMuNjYsMCwwLDEsMS42NS03LjE4LDQ5LjQ2LDQ5LjQ2LDAsMCwxLDktMThDMTA4LjkyLDg4LjI3LDEyMS43Myw4NCwxMzYsODRzMjcuMDgsNC4yNywzNS44NywxNS4wOGE0OS40Niw0OS40NiwwLDAsMSw5LDE4LDczLjY2LDczLjY2LDAsMCwxLDEuNjUsNy4xOEExMDIuMzksMTAyLjM5LDAsMCwxLDE4NCwxMzkuNzhDMTg0LDE0MC43NywxODQsMTQxLjc4LDE4NCwxNDIuOFoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNzEuODcsOTkuMThhNzYuNTgsNzYuNTgsMCwwLDEtNzEuNzQsMCw0OS40Niw0OS40NiwwLDAsMC05LDE4YzEuMjYsMSwyLjU4LDIsMy45NCwyLjkxYTczLjIyLDczLjIyLDAsMCwwLDQwLjkxLDEyLDczLjIyLDczLjIyLDAsMCwwLDQwLjkxLTEyYzEuMzYtLjkzLDIuNjgtMS44OSwzLjk0LTIuOTFBNDkuNDYsNDkuNDYsMCwwLDAsMTcxLjg3LDk5LjE4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE4NCwxMzkuODhjLTExLjczLDEwLTI4Ljg3LDE2LjIyLTQ4LDE2LjIycy0zNi4yMy02LjI3LTQ4LTE2LjIyYzAsMSwwLDIsMCwzLDAsMTkuNzEsOS42LDQzLjYzLDIwLjIxLDY0YTc3LjU1LDc3LjU1LDAsMCwwLDU1LjU4LDBjMTAuNjEtMjAuNDIsMjAuMjEtNDQuMzQsMjAuMjEtNjRDMTg0LDE0MS44OCwxODQsMTQwLjg3LDE4NCwxMzkuODhaIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIxMzYiIGN5PSI2MCIgcj0iMzIiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMjAuMzEsMzZsNy45MS0yTDEyNSwyMi44NWE0LjEzLDQuMTMsMCwwLDAtNS0yLjcyaDBhMy44MywzLjgzLDAsMCwwLTIuODksNC43MVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTEuNjcsMzZsLTcuOTEtMiwzLjE4LTExLjE1YTQuMTMsNC4xMywwLDAsMSw1LTIuNzJoMGEzLjgzLDMuODMsMCwwLDEsMi44OSw0LjcxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE5Mi4yMiwxODMuNThjMjguMDcsMjguMDcsNDcsMjQuMiw2MSwxMC4xNnMxNy45LTMyLjkyLTEwLjE2LTYxUzE1MS41Niw5Mi4xLDE1MS41Niw5Mi4xLDE2NC4xNSwxNTUuNTEsMTkyLjIyLDE4My41OFoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik03OS43OCwxODMuNThjLTI4LjA3LDI4LjA3LTQ3LDI0LjItNjEsMTAuMTZTLjg5LDE2MC44MywyOSwxMzIuNzYsMTIwLjQ0LDkyLjEsMTIwLjQ0LDkyLjEsMTA3Ljg1LDE1NS41MSw3OS43OCwxODMuNThaIi8+PC9zdmc+';

interface MarkerData {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  imageUrl?: string;
  onPress?: () => void;
}

interface OpenStreetMapProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers?: MarkerData[];
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  showsUserLocation?: boolean;
  style?: any;
}

interface OpenStreetMapRef {
  animateToRegion: (region: { latitude: number; longitude: number }) => void;
}

const OpenStreetMapComponent = forwardRef<OpenStreetMapRef, OpenStreetMapProps>(
  ({ initialRegion, markers = [], onMapPress, showsUserLocation = false, style }, ref) => {
    const { isDarkMode } = useTheme();
    const webViewRef = useRef<WebView>(null);
    const [isMapReady, setMapReady] = useState(false);

    useImperativeHandle(ref, () => ({
      animateToRegion: (region: { latitude: number; longitude: number }) => {
        const script = `window.leafletMap?.setView([${region.latitude}, ${region.longitude}], 15, { animate: true });`;
        webViewRef.current?.injectJavaScript(script);
      },
    }));

    const updateMarkersTimeoutRef = useRef<NodeJS.Timeout>();

    const updateMarkersDebounced = useCallback(
      (markersToUpdate: MarkerData[]) => {
        if (updateMarkersTimeoutRef.current) {
          clearTimeout(updateMarkersTimeoutRef.current);
        }

        updateMarkersTimeoutRef.current = setTimeout(() => {
          if (isMapReady && webViewRef.current) {
            logger.debug(
              '🗺️ RN: Enviando marcadores para WebView (debounced):',
              markersToUpdate.length,
            );
            const script = `window.updateMarkers && window.updateMarkers(${JSON.stringify(
              markersToUpdate,
            )});`;
            webViewRef.current.injectJavaScript(script);
          }
        }, 100);
      },
      [isMapReady],
    );

    useEffect(() => {
      updateMarkersDebounced(markers);

      return () => {
        if (updateMarkersTimeoutRef.current) {
          clearTimeout(updateMarkersTimeoutRef.current);
        }
      };
    }, [markers, updateMarkersDebounced]);

    const defaultRegion = {
      latitude: -14.235004,
      longitude: -51.92528,
      latitudeDelta: 40,
      longitudeDelta: 40,
    };

    const region = initialRegion || defaultRegion;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>OpenStreetMap</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body { margin: 0; padding: 0; background-color: ${isDarkMode ? '#1c1c1e' : '#f2f2f2'}; }
            #map { height: 100vh; width: 100vw; }
            .bee-marker-icon { 
                width: 40px !important; 
                height: 40px !important; 
                background-image: url('${BEE_PIN_BASE64}') !important; 
                background-size: contain !important; 
                background-repeat: no-repeat !important; 
                background-position: center !important; 
                cursor: pointer !important;
                border: none !important;
                border-radius: 0 !important;
            }
            .leaflet-popup-content-wrapper { background-color: ${
              isDarkMode ? '#2c2c2c' : '#ffffff'
            }; color: ${
      isDarkMode ? '#ffffff' : '#000000'
    }; border-radius: 12px; box-shadow: 0 3px 14px rgba(0,0,0,0.4); }
            .leaflet-popup-content { margin: 0; padding: 0; width: 180px !important; }
            .popup-container { width: 180px; }
            .popup-image { width: 100%; height: 90px; object-fit: cover; border-top-left-radius: 12px; border-top-right-radius: 12px; }
            .popup-text-container { padding: 8px 12px; text-align: center; }
            .popup-title { margin: 0 0 4px 0; color: ${
              isDarkMode ? '#ffffff' : '#000000'
            }; font-size: 16px; font-weight: bold; }
            .popup-description { margin: 0; color: ${
              isDarkMode ? '#cccccc' : '#666666'
            }; font-size: 14px; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            function logToRN(message, ...args) {
                window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'log', message: message, args: args }));
            }

            function postMessage(data) { window.ReactNativeWebView?.postMessage(JSON.stringify(data)); }
            
            function handlePopupClick(markerId) {
                logToRN('WebView: Popup clicado para marcador:', markerId);
                postMessage({ type: 'popupPress', id: markerId });
            }

            window.leafletMap = L.map('map').setView([${region.latitude}, ${region.longitude}], 10);
            window.markerLayer = L.layerGroup().addTo(window.leafletMap);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                maxZoom: 19, 
                attribution: '© OpenStreetMap'
            }).addTo(window.leafletMap);

            function addMarker(markerData) {
                try {
                    const lat = markerData.coordinate.latitude || markerData.coordinate.lat;
                    const lng = markerData.coordinate.longitude || markerData.coordinate.lng;
                    
                    const beeIcon = L.divIcon({ 
                        className: 'bee-marker-icon',
                        iconSize: [40, 40], 
                        iconAnchor: [20, 40], 
                        popupAnchor: [0, -40],
                        html: ''
                    });
                    
                    const marker = L.marker([lat, lng], { 
                        icon: beeIcon 
                    });
                    
                    if (markerData.title || markerData.description) {
                        const popupContent = \`<div class="popup-container" onclick="handlePopupClick('\${markerData.id}')">\${markerData.imageUrl ? \`<img src="\${markerData.imageUrl}" class="popup-image" />\` : ''}<div class="popup-text-container"><h3 class="popup-title">\${markerData.title || ''}</h3><p class="popup-description">\${markerData.description || ''}</p></div></div>\`;
                        marker.bindPopup(popupContent);
                    }
                    
                    marker.on('click', () => {
                        logToRN('WebView: Marcador clicado:', markerData.id);
                        marker.openPopup();
                    });
                    
                    window.markerLayer.addLayer(marker);
                } catch (e) {
                    logToRN('WebView ERRO ao adicionar marcador:', e.message, markerData);
                }
            }

            window.updateMarkers = function(markers) {
                if (!window.existingMarkers) {
                    window.existingMarkers = new Map();
                }
                
                const newMarkerIds = new Set();
                
                if (markers && Array.isArray(markers) && markers.length > 0) {
                    markers.forEach((markerData) => {
                        newMarkerIds.add(markerData.id);
                        
                        const existingMarker = window.existingMarkers.get(markerData.id);
                        
                        const lat = markerData.coordinate.latitude || markerData.coordinate.lat;
                        const lng = markerData.coordinate.longitude || markerData.coordinate.lng;
                        
                        if (existingMarker && 
                            existingMarker.getLatLng().lat === lat &&
                            existingMarker.getLatLng().lng === lng) {
                            return;
                        }
                        
                        if (existingMarker) {
                            window.markerLayer.removeLayer(existingMarker);
                            window.existingMarkers.delete(markerData.id);
                        }
                        
                        try {
                            const beeIcon = L.divIcon({ 
                                className: 'bee-marker-icon',
                                iconSize: [40, 40], 
                                iconAnchor: [20, 40], 
                                popupAnchor: [0, -40],
                                html: ''
                            });
                            
                            const marker = L.marker([lat, lng], { 
                                icon: beeIcon 
                            });
                            
                            if (markerData.title || markerData.description) {
                                const popupContent = \`<div class="popup-container" onclick="handlePopupClick('\${markerData.id}')">\${markerData.imageUrl ? \`<img src="\${markerData.imageUrl}" class="popup-image" />\` : ''}<div class="popup-text-container"><h3 class="popup-title">\${markerData.title || ''}</h3><p class="popup-description">\${markerData.description || ''}</p></div></div>\`;
                                marker.bindPopup(popupContent);
                            }
                            
                            marker.on('click', () => {
                                logToRN('WebView: Marcador clicado:', markerData.id);
                                marker.openPopup();
                            });
                            
                            window.markerLayer.addLayer(marker);
                            window.existingMarkers.set(markerData.id, marker);
                        } catch (e) {
                            logToRN('WebView ERRO ao adicionar marcador:', e.message, markerData);
                        }
                    });
                }
                
                if (window.existingMarkers) {
                    for (const [markerId, marker] of window.existingMarkers.entries()) {
                        if (!newMarkerIds.has(markerId)) {
                            window.markerLayer.removeLayer(marker);
                            window.existingMarkers.delete(markerId);
                        }
                    }
                }
            };

            window.leafletMap.on('click', e => {
                postMessage({ type: 'mapPress', coordinate: e.latlng });
            });

            window.handlePopupClick = function(markerId) {
                postMessage({ type: 'popupPress', id: markerId });
            };

            ${
              showsUserLocation
                ? `
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(pos => {
                        const userIcon = L.divIcon({ 
                            className: 'user-location', 
                            html: '<div style="width: 20px; height: 20px; background-color: #007AFF; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>', 
                            iconSize: [20, 20] 
                        });
                        L.marker([pos.coords.latitude, pos.coords.longitude], { 
                            icon: userIcon, 
                            zIndexOffset: 1000 
                        }).addTo(window.leafletMap);
                    }, error => {
                        logToRN('WebView: Erro ao obter localização:', error.message);
                    });
                }`
                : ''
            }

            postMessage({ type: 'mapReady' });
        </script>
    </body>
    </html>`;

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === 'log') {
          logger.debug(`[WebView] ${data.message}`, ...(data.args || []));
          return;
        }

        logger.debug('🗺️ RN: Mensagem recebida da WebView:', data.type);

        if (data.type === 'mapReady') {
          if (!isMapReady) {
            logger.debug('🗺️ RN: Mapa está pronto, enviando marcadores iniciais...');
            setMapReady(true);
            setTimeout(() => {
              if (markers.length > 0 && webViewRef.current) {
                logger.debug('🗺️ RN: Enviando marcadores iniciais:', markers.length);
                const script = `window.updateMarkers && window.updateMarkers(${JSON.stringify(
                  markers,
                )});`;
                webViewRef.current.injectJavaScript(script);
              }
            }, 500);
          }
        } else if (data.type === 'markerPress') {
          logger.debug('🗺️ RN: Marcador clicado, popup aberto');
        } else if (data.type === 'popupPress') {
          const marker = markers.find(m => m.id === data.id);
          logger.debug('🗺️ RN: Popup clicado, navegando para colmeia:', data.id);
          marker?.onPress?.();
        } else if (data.type === 'mapPress' && onMapPress) {
          const normalizedCoordinate = {
            latitude: data.coordinate.lat,
            longitude: data.coordinate.lng,
          };
          logger.debug(
            '🗺️ RN: Map press detected, calling onMapPress with normalized coordinate:',
            normalizedCoordinate,
          );
          onMapPress(normalizedCoordinate);
        }
      } catch {}
    };

    return (
      <View style={[styles.container, style]}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={error => logger.error('🗺️ RN: WebView erro:', error.nativeEvent)}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 },
});

OpenStreetMapComponent.displayName = 'OpenStreetMapComponent';
export default OpenStreetMapComponent;
