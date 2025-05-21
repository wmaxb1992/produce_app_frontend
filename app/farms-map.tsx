import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Dimensions,
  Image,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MapPin, ChevronLeft, List, Map, Navigation } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import useFarmStore from '@/store/useFarmStore';
import useUserStore from '@/store/useUserStore';
import FarmCard from '@/components/farm/FarmCard';
import * as Location from 'expo-location';
import { greenMapStyle } from '@/constants/mapStyles';

// Import barn image for map markers
const barnIcon = require('./barn.png');

// Log the map styles to confirm they're being loaded
console.log('Loaded green map style with', greenMapStyle.length, 'style elements');

// Define types for map components
type RegionType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// Dynamically import MapView to handle potential errors
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = undefined;

try {
  // Importing with require() can sometimes fail in Expo Go
  const Maps = require('react-native-maps');
  if (!Maps || !Maps.default) {
    console.error('react-native-maps loaded but MapView is undefined');
    throw new Error('MapView is undefined');
  }
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  console.log('Successfully loaded react-native-maps components');
} catch (error) {
  console.error('Failed to load react-native-maps:', error);
}

const { width, height } = Dimensions.get('window');

// Function to generate random coordinates around a center point
const generateRandomCoordinates = (centerLat: number, centerLng: number, radiusKm: number) => {
  const radiusEarth = 6371; // Earth's radius in kilometers
  // Ensure farms are distributed more widely within the radius
  // Minimum distance from center is 10% of the radius, maximum is full radius
  const minDistance = radiusKm * 0.1;
  const randomDistance = minDistance + (Math.random() * (radiusKm - minDistance));
  const randomAngle = Math.random() * 2 * Math.PI;
  
  // Convert distance to latitude and longitude changes
  const latChange = (randomDistance / radiusEarth) * (180 / Math.PI);
  const lngChange = (randomDistance / radiusEarth) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);
  
  return {
    latitude: centerLat + latChange * Math.cos(randomAngle),
    longitude: centerLng + lngChange * Math.sin(randomAngle),
  };
};

// Function to geocode an address to coordinates
const geocodeAddress = async (address: string) => {
  try {
    const geocodedLocation = await Location.geocodeAsync(address);
    if (geocodedLocation && geocodedLocation.length > 0) {
      return {
        latitude: geocodedLocation[0].latitude,
        longitude: geocodedLocation[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Default region (San Francisco)
const defaultRegion: RegionType = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// Los Angeles region (backup if geocoding fails, with 100-mile radius view)
const losAngelesRegion: RegionType = {
  latitude: 34.0522,
  longitude: -118.2437,
  latitudeDelta: 2.5,  // Increased to show ~100-mile radius
  longitudeDelta: 2.5, // Increased to show ~100-mile radius
};

// Flores Street, Los Angeles (more specific location with 100-mile radius view)
const floresLARegion: RegionType = {
  latitude: 34.0723,
  longitude: -118.3545,
  latitudeDelta: 2.5,  // Increased to show ~100-mile radius
  longitudeDelta: 2.5, // Increased to show ~100-mile radius
};

export default function FarmsMapScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { farms } = useFarmStore();
  const { user } = useUserStore();
  const [viewMode, setViewMode] = useState<'map' | 'split' | 'list'>('split'); // Default to split view showing both map and list
  const [farmLocations, setFarmLocations] = useState<any[]>([]);
  const [currentRegion, setCurrentRegion] = useState<RegionType>(floresLARegion); // Default to LA region instead of SF
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [mapError, setMapError] = useState(!MapView);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // New state for tracking the selected farm and last click timestamp
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  
  // New ref for the FlatList
  const flatListRef = useRef<any>(null);
  
  // Get user address and geocode it
  useEffect(() => {
    const getUserAddressLocation = async () => {
      if (user?.addresses && user.addresses.length > 0) {
        // Find default address or use the first one
        const defaultAddress = user.addresses.find(addr => addr.default) || user.addresses[0];
        const addressString = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zip}`;
        
        try {
          // Check for Los Angeles first
          if (defaultAddress.street.includes('Flores') || 
              defaultAddress.street.includes('109 S') ||
              (defaultAddress.city && 
               (defaultAddress.city.toLowerCase().includes('los angeles') || 
                defaultAddress.city.toLowerCase() === 'la'))) {
            console.log('Using LA Flores region');
            setCurrentRegion(floresLARegion);
            return;
          }
          
          // Try to geocode if not in LA
          const geocodedLocation = await geocodeAddress(addressString);
          if (geocodedLocation) {
            console.log('Geocoded location:', geocodedLocation);
            setCurrentRegion({
              latitude: geocodedLocation.latitude,
              longitude: geocodedLocation.longitude,
              latitudeDelta: 2.5,  // Increased to show ~100-mile radius
              longitudeDelta: 2.5, // Increased to show ~100-mile radius
            });
          } else if (defaultAddress.state && defaultAddress.state.toUpperCase() === 'CA') {
            // If geocoding fails but we know it's in California
            console.log('Geocoding failed, using LA region as fallback');
            setCurrentRegion(losAngelesRegion);
          }
        } catch (error) {
          console.error('Error setting user address location:', error);
          // If there's an error, default to LA instead of SF
          setCurrentRegion(losAngelesRegion);
        }
      } else {
        // If no addresses, use LA instead of SF
        setCurrentRegion(losAngelesRegion);
      }
    };
    
    getUserAddressLocation();
  }, [user]);
  
  // Request location permissions and get user's location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocationPermissionDenied(true);
          setErrorMessage('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'To see farms near your location, please enable location services for this app.'
          );
          return;
        }
        
        try {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
          
          // Only update map region to user's location if explicitly requested
          // Don't override address-based region by default
        } catch (error) {
          console.error('Error getting location:', error);
          setErrorMessage('Could not get your location');
        }
      } catch (error) {
        console.error('Error requesting location permissions:', error);
        setErrorMessage('Location permission error');
      }
    })();
  }, [user]);
  
  // Create farm locations with random coordinates around center point
  useEffect(() => {
    if (farms.length) {
      // Use user location if available, otherwise use current region
      const centerLat = userLocation?.coords.latitude || currentRegion.latitude;
      const centerLng = userLocation?.coords.longitude || currentRegion.longitude;
      
      const locations = farms.map(farm => {
        // If farm already has coordinates, use those
        if (farm.location?.coordinates?.latitude && farm.location?.coordinates?.longitude) {
          return {
            ...farm,
            latitude: farm.location.coordinates.latitude,
            longitude: farm.location.coordinates.longitude,
          };
        }
        // Otherwise generate random coordinates (within 100-mile radius)
        return {
          ...farm,
          ...generateRandomCoordinates(centerLat, centerLng, 100),
        };
      });
      
      setFarmLocations(locations);
    }
  }, [farms, userLocation, currentRegion]);
  
  const toggleViewMode = () => {
    if (mapError) {
      Alert.alert(
        'Maps Not Available',
        'The map feature is not available in this environment. Please use the list view instead.'
      );
      return;
    }
    setViewMode(viewMode === 'map' ? 'split' : 'map');
  };
  
  const handleMarkerPress = (farmId: string) => {
    const now = new Date().getTime();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    // Find the index of the selected farm in the farms array
    const farmIndex = farms.findIndex(farm => farm.id === farmId);
    
    // If list view is visible, scroll to the selected farm
    if (viewMode === 'split' && farmIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: farmIndex,
        animated: true,
        viewPosition: 0, // Position it at the top of the visible area
      });
    }
    
    // If same marker clicked within 500ms, consider it a double click
    if (selectedFarmId === farmId && timeSinceLastClick < 500) {
      // Navigate to the farm details screen on second click
      router.push(`/farm/${farmId}`);
      // Reset selected farm
      setSelectedFarmId(null);
    } else {
      // First click, just select the farm (which will show its callout)
      setSelectedFarmId(farmId);
    }
    
    // Update the last click time
    lastClickTimeRef.current = now;
  };

  const zoomToUserLocation = async () => {
    if (mapError) return;
    
    if (userLocation) {
      setCurrentRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 2.5,  // Increased to show ~100-mile radius
        longitudeDelta: 2.5, // Increased to show ~100-mile radius
      });
    } else {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          // If location permission denied, zoom to the user's default address instead
          if (user?.addresses && user.addresses.length > 0) {
            const defaultAddress = user.addresses.find(addr => addr.default) || user.addresses[0];
            
            // Check for Los Angeles address
            if (defaultAddress.city.toLowerCase().includes('los angeles') || 
                defaultAddress.city.toLowerCase() === 'la' ||
                defaultAddress.street.includes('Flores')) {
              setCurrentRegion(floresLARegion);
              return;
            }
            
            // Try to geocode the address
            const addressString = `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zip}`;
            const geocodedLocation = await geocodeAddress(addressString);
            if (geocodedLocation) {
              setCurrentRegion({
                latitude: geocodedLocation.latitude,
                longitude: geocodedLocation.longitude,
                latitudeDelta: 2.5,  // Increased to show ~100-mile radius
                longitudeDelta: 2.5, // Increased to show ~100-mile radius
              });
              return;
            }
          }
          
          Alert.alert(
            'Permission Denied',
            'To see farms near your location, please enable location services for this app.'
          );
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
        
        setCurrentRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 2.5,  // Increased to show ~100-mile radius
          longitudeDelta: 2.5, // Increased to show ~100-mile radius
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMessage('Could not get your location');
        
        // Fall back to the user's address if available
        if (user?.addresses && user.addresses.length > 0) {
          const defaultAddress = user.addresses.find(addr => addr.default) || user.addresses[0];
          if (defaultAddress.city.toLowerCase().includes('los angeles')) {
            setCurrentRegion(floresLARegion);
          } else {
            setCurrentRegion(losAngelesRegion);
          }
        }
      }
    }
  };

  // Render the fallback view when maps aren't available
  const renderFallbackView = () => {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.fallbackContainer}>
          <Text style={[styles.fallbackTitle, { color: colors.text }]}>
            Farms Near You
          </Text>
          <Text style={[styles.fallbackText, { color: colors.text }]}>
            Map view is not available in this environment.
          </Text>
          {errorMessage && (
            <Text style={[styles.fallbackText, { color: colors.error || 'red' }]}>
              Error: {errorMessage}
            </Text>
          )}
          <Text style={[styles.fallbackText, { color: colors.text, marginBottom: 20 }]}>
            Please check out our farms in the list below:
          </Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={farms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.farmItem,
              selectedFarmId === item.id && styles.selectedFarmItem
            ]}>
              <FarmCard farm={item} listView={true} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.farmsList}
          onScrollToIndexFailed={(info) => {
            // Handle potential scroll failures
            console.warn('Failed to scroll to farm:', info);
            // Fallback: Try with a timeout
            setTimeout(() => {
              if (flatListRef.current) {
                flatListRef.current.scrollToOffset({
                  offset: info.index * (info.averageItemLength || 200),
                  animated: true,
                });
              }
            }, 100);
          }}
        />
      </View>
    );
  };
  
  // If maps aren't available, render the fallback view
  if (mapError) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: '',
            headerTransparent: true,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: 'white',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        {renderFallbackView()}
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={toggleViewMode}>
              {viewMode === 'map' ? (
                <List size={24} color="white" />
              ) : (
                <Map size={24} color="white" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {viewMode === 'map' ? (
          // Full map view
          <View style={styles.fullMapContainer}>
            {MapView && (
              <MapView 
                style={styles.fullMap}
                region={currentRegion}
                provider={PROVIDER_GOOGLE}
                customMapStyle={greenMapStyle}
                showsUserLocation
                showsMyLocationButton={false}
                onError={(error: Error) => {
                  console.error('MapView error:', error);
                  setMapError(true);
                  setErrorMessage('Error loading map');
                }}
              >
                {farmLocations.map((farm) => (
                  <Marker
                    key={farm.id}
                    coordinate={{
                      latitude: farm.latitude,
                      longitude: farm.longitude,
                    }}
                    title={farm.name}
                    description={`${farm.location?.city}, ${farm.location?.state}`}
                    onPress={() => handleMarkerPress(farm.id)}
                    onSelect={() => setSelectedFarmId(farm.id)}
                  >
                    <Image 
                      source={barnIcon}
                      style={selectedFarmId === farm.id ? styles.selectedMarkerImage : styles.markerImage}
                    />
                  </Marker>
                ))}
              </MapView>
            )}
            
            <TouchableOpacity 
              style={[styles.myLocationButton, { backgroundColor: colors.card }]}
              onPress={zoomToUserLocation}
            >
              <Navigation size={12} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          // Split view (map + list)
          <>
            {/* Map View */}
            <View style={styles.mapContainer}>
              {MapView && (
                <MapView 
                  style={styles.mapHalf}
                  region={currentRegion}
                  provider={PROVIDER_GOOGLE}
                  customMapStyle={greenMapStyle}
                  showsUserLocation
                  showsMyLocationButton={false}
                  onError={(error: Error) => {
                    console.error('MapView error:', error);
                    setMapError(true);
                    setErrorMessage('Error loading map');
                  }}
                >
                  {farmLocations.map((farm) => (
                    <Marker
                      key={farm.id}
                      coordinate={{
                        latitude: farm.latitude,
                        longitude: farm.longitude,
                      }}
                      title={farm.name}
                      description={`${farm.location?.city}, ${farm.location?.state}`}
                      onPress={() => handleMarkerPress(farm.id)}
                      onSelect={() => setSelectedFarmId(farm.id)}
                    >
                      <Image 
                        source={barnIcon}
                        style={selectedFarmId === farm.id ? styles.selectedMarkerImage : styles.markerImage}
                      />
                    </Marker>
                  ))}
                </MapView>
              )}
              
              <TouchableOpacity 
                style={[styles.myLocationButton, { backgroundColor: colors.card }]}
                onPress={zoomToUserLocation}
              >
                <Navigation size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* List View */}
            <View style={[styles.listContainer, { backgroundColor: colors.card }]}>
              <View style={styles.listHeader}>
                <Text style={[styles.listHeaderText, { color: colors.text }]}>
                  {farms.length} Farms Found
                </Text>
              </View>
              
              <FlatList
                ref={flatListRef}
                data={farms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[
                    styles.farmItem,
                    selectedFarmId === item.id && styles.selectedFarmItem
                  ]}>
                    <FarmCard farm={item} listView={true} />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.farmsList}
                onScrollToIndexFailed={(info) => {
                  // Handle potential scroll failures
                  console.warn('Failed to scroll to farm:', info);
                  // Fallback: Try with a timeout
                  setTimeout(() => {
                    if (flatListRef.current) {
                      flatListRef.current.scrollToOffset({
                        offset: info.index * (info.averageItemLength || 200),
                        animated: true,
                      });
                    }
                  }, 100);
                }}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallbackContainer: {
    padding: 16,
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  fullMapContainer: {
    flex: 1,
    position: 'relative',
  },
  fullMap: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    height: '40%',
    width: '100%',
    position: 'relative',
  },
  mapHalf: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    zIndex: 1,
  },
  listHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  farmsList: {
    padding: 16,
    paddingBottom: 32,
  },
  farmItem: {
    marginBottom: 16,
    width: '100%',
  },
  selectedFarmItem: {
    borderWidth: 2,
    borderColor: '#4CAF50', // Green border
    borderRadius: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.05)', // Very light green background
  },
  markerContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedMarkerImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
    transform: [{ scale: 1.2 }],
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 36,
    right: 16,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
}); 