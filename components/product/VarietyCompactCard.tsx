import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import honeycrisp from '../../assets/images/farmitem_iconphotos/honeycrisp_apple.png';
import haasAvocado from '../../assets/images/farmitem_iconphotos/haas_avocado.png';
import cherryTomato from '../../assets/images/farmitem_iconphotos/cherry_tomato.png';
import russetPotato from '../../assets/images/farmitem_iconphotos/russet_potato.png';

import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { Product, Variety } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { Zap, Plus } from 'lucide-react-native';

interface VarietyCompactCardProps {
  variety: Variety;
  products: Product[];
  onPress: () => void;
}

const CARD_WIDTH = (Dimensions.get('window').width - 32 - 16) / 6; // 6 cards per row with more padding

const getImageSource = (path: string) => {
  const mapping: Record<string, any> = {
    '../assets/images/farmitem_iconphotos/honeycrisp_apple.png': honeycrisp,
    '../assets/images/farmitem_iconphotos/haas_avocado.png': haasAvocado,
    '../assets/images/farmitem_iconphotos/cherry_tomato.png': cherryTomato,
    '../assets/images/farmitem_iconphotos/russet_potato.png': russetPotato,
  };
  return mapping[path] || honeycrisp;
};

const VarietyCompactCard: React.FC<VarietyCompactCardProps> = ({ variety, products, onPress }) => {
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const handleAddToCart = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Prevent card press
    setIsAdding(true);
    onPress();
    setTimeout(() => setIsAdding(false), 1000); // Reset after 1s
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const { colors } = useTheme();
  
  // Get the lowest price among all products of this variety
  const lowestPrice = Math.min(...products.map(p => p.price));
  // Get the number of farms that have this variety instantly available
  const farmCount = new Set(products.map(p => p.farmId)).size;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={() => handleProductPress(products[0].id)}
        activeOpacity={0.7}
      >
        <Image 
          source={getImageSource(variety.cardImage)}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.lightningContainer}>
          <Zap size={16} color="#4CAF50" fill="#A5D6A7" stroke="#1B5E20" strokeWidth={1.0} />
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.gray[200] }]}
          onPress={handleAddToCart}
          activeOpacity={0.7}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Plus size={16} color={colors.text} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>
          {variety.name}
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.price, { color: colors.text }]}>${lowestPrice.toFixed(2)}</Text>
          <Text style={[styles.avgText, { color: colors.text }]}> each</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 4,
    marginBottom: -2,
    borderRadius: 8,
    backgroundColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    paddingBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  lightningContainer: {
    position: 'absolute',
    top: -3,
    right: -4,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',

  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 1,
    width: 22,
    height: 22,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: -6,
  },
  content: {
    padding: 0,
    paddingBottom: 6,
    
  },
  name: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  price: {
    fontSize: 10,
    fontWeight: '600',
  },
  avgText: {
    fontSize: 9,
    marginLeft: 2,
  },
});

export default VarietyCompactCard;
