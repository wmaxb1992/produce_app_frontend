import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
        
        <Image 
          source={{ uri: farm.coverImage }} 
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Star 
              size={16} 
              color={colors.secondary} 
              fill={colors.secondary} 
            />
            <Text style={[styles.rating, { color: colors.text }]}>
              {farm.rating.toFixed(1)} ({farm.reviewCount})
            </Text>
          </View>
          
          <View style={styles.specialtiesContainer}>
            {farm.specialties.slice(0, 2).map((specialty, index) => (
              <View 
                key={index} 
                style={[
                  styles.specialtyBadge, 
                  { backgroundColor: colors.gray[100] }
                ]}
              >
                <Text 
                  style={[styles.specialtyText, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {specialty}
                </Text>
              </View>
            ))}
            {farm.specialties.length > 2 && (
              <Text style={[styles.moreText, { color: colors.subtext }]}>
                +{farm.specialties.length - 2}
              </Text>
            )}
          </View>
        </View>
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
  footer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'flex-end',
  },
  specialtyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 80,
  },
  moreText: {
    fontSize: 12,
    marginLeft: 6,
  },
});

export default FarmCard;