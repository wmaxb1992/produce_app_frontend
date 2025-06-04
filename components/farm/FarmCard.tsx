import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import { Farm } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import Card from '@/components/ui/Card';

interface FarmCardProps {
  farm: Farm;
  onPress?: () => void;
  listView?: boolean;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, onPress, listView }) => {
  const router = useRouter();
  const { colors } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/farm/${farm.id}`);
    }
  };
  
  return (
    <Card style={{
      ...styles.card, 
      ...(listView ? styles.listCard : styles.gridCard)
    }}>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: farm.logo }} 
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {farm.name}
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.subtext} />
              <Text style={[styles.location, { color: colors.subtext }]} numberOfLines={1}>
                {farm.location.city}, {farm.location.state}
              </Text>
            </View>
          </View>
        </View>
        {/* Image and overlays container */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: farm.coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
          {/* Rating at top right, no overlay */}
          <View style={styles.ratingTopRight}>
            <Star 
              size={16} 
              color={colors.secondary} 
              fill={colors.secondary} 
            />
            <Text style={[styles.rating, styles.ratingTextShadow, { color: colors.white }]}> {/* white for contrast */}
              {farm.rating.toFixed(1)} ({farm.reviewCount})
            </Text>
          </View>
          {/* Specialties overlay at bottom */}
          <View style={styles.overlayContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.specialtiesContainerOverlay}
            >
              {farm.specialties.map((specialty, index) => (
                <View 
                  key={index} 
                  style={styles.specialtyBadge}
                >
                  {typeof specialty === 'object' && specialty.emoji && (
                    <Text style={styles.specialtyEmoji}>{specialty.emoji}</Text>
                  )}
                  <Text 
                    style={[styles.specialtyText, { color: colors.white }]} 
                    numberOfLines={1}
                  >
                    {typeof specialty === 'object' && specialty.name ? specialty.name : specialty}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        {/* End overlays */}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  gridCard: {
    width: 260,
  },
  listCard: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContent: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 0,
    paddingHorizontal: 2,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 34,
  },
  ratingTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  ratingTextShadow: {
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginLeft: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  specialtiesContainerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    minHeight: 32,
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    minHeight: 22,
    justifyContent: 'center',
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 80,
  },
  imageContainer: {
    position: 'relative',
  },
  specialtyEmoji: {
    marginRight: 4,
    fontSize: 16,
    lineHeight: 18,
  },
});

export default FarmCard;