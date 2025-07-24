import React, { forwardRef, ReactNode } from 'react';
import OpenStreetMapComponent from './OpenStreetMapComponent';
import { logger } from '@/utils/logger';

interface BeeMarkerProps {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  imageUrl?: string;
  onPress?: () => void;
  children?: ReactNode;
}

interface UnifiedMapComponentProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showsUserLocation?: boolean;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  style?: any;
  children?: ReactNode;
}

interface UnifiedMapComponentRef {
  animateToRegion: (region: { latitude: number; longitude: number }) => void;
}

const UnifiedMapComponent = forwardRef<UnifiedMapComponentRef, UnifiedMapComponentProps>(
  ({ children, ...mapProps }, ref) => {
    const markers: {
      id: string;
      coordinate: { latitude: number; longitude: number };
      title?: string;
      description?: string;
      imageUrl?: string;
      onPress?: () => void;
    }[] = [];

    if (children) {
      React.Children.forEach(children, child => {
        if (React.isValidElement(child) && child.type === BeeMarker) {
          const props = child.props as BeeMarkerProps;
          if (!props.id) {
            logger.warn(
              'BeeMarker está sem uma prop "id" única. Isso pode causar problemas de renderização.',
            );
          }
          markers.push({ ...props });
        }
      });
    }

    return <OpenStreetMapComponent ref={ref} markers={markers} {...mapProps} />;
  },
);

const BeeMarker: React.FC<BeeMarkerProps> = () => {
  return null;
};

UnifiedMapComponent.displayName = 'UnifiedMapComponent';
BeeMarker.displayName = 'BeeMarker';

export default UnifiedMapComponent;
export { BeeMarker };
export type { UnifiedMapComponentRef };
