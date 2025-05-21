import React from 'react';
import { View, FlatList } from 'react-native';
import { homeStyles } from '@/styles/layouts/home';
import { Variety } from '@/types';
import VarietyCard from '@/components/product/VarietyCard';

interface VarietyListProps {
  style?: any;
  varieties: Variety[];
  selectedVariety?: string | null;
  onVarietyPress?: (varietyId: string) => void;
}

const VarietyList: React.FC<VarietyListProps> = ({
  style,
  varieties,
  selectedVariety,
  onVarietyPress
}) => {
  return (
    <View style={[homeStyles.section, { marginTop: 0 }, style]}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.varietiesContainer}
        data={varieties}
        keyExtractor={(variety) => variety.id}
        renderItem={({ item: variety }) => (
          <VarietyCard
            variety={variety}
            isSelected={selectedVariety === variety.id}
            onPress={() => onVarietyPress?.(variety.id)}
          />
        )}
      />
    </View>
  );
};

export default VarietyList;
