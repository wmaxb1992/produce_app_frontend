import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';

interface Location {
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

interface MapViewProps {
  location: Location;
  height?: number;
  width?: number;
  style?: any;
  showsUserLocation?: boolean;
  zoomEnabled?: boolean;
  scrollEnabled?: boolean;
}

/**
 * A cross-platform MapView component that works on all platforms
 * This is a simplified version that doesn't require react-native-maps
 */
const MapView: React.FC<MapViewProps> = ({
  location,
  height = 200,
  width,
  style,
  showsUserLocation,
  zoomEnabled,
  scrollEnabled,
}) => {
  const { getThemeValues } = useThemeStore();
  const theme = getThemeValues();
  const { colors } = theme;

  return (
    <View
      style={[
        styles.container,
        { height, width, backgroundColor: colors.gray[100] },
        style,
      ]}
    >
      <View style={styles.pinContainer}>
        <MapPin size={32} color={colors.primary} />
      </View>
      
      <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {location.title || 'Location'}
        </Text>
        
        <Text style={[styles.coordinates, { color: colors.subtext }]}>
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </Text>
        
        {location.description && (
          <Text style={[styles.description, { color: colors.text }]}>
            {location.description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -32,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});

export default MapView;