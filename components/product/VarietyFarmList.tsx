import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import { nestedListStyles as styles } from '@/styles/components/lists/nestedList';
import { spacing } from '@/styles/theme';
import type { Variety, Farm } from '@/types';
import { useRouter } from 'expo-router';

interface VarietyWithFarms extends Variety {
  farms: Farm[];
}

interface VarietyFarmListProps {
  data: VarietyWithFarms[];
  onVarietyPress?: (variety: Variety) => void;
  onFarmPress?: (farm: Farm) => void;
}

const VarietyFarmList: React.FC<VarietyFarmListProps> = ({
  data,
  onVarietyPress,
  onFarmPress,
}) => {
  const { theme } = useThemeStore();
  const router = useRouter();
  const [expandedVarieties, setExpandedVarieties] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleVariety = (varietyId: string) => {
    setExpandedVarieties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(varietyId)) {
        newSet.delete(varietyId);
      } else {
        newSet.add(varietyId);
      }
      return newSet;
    });
  };

  const renderVariety = ({ item: variety }: { item: VarietyWithFarms }) => {
    const isExpanded = expandedVarieties.has(variety.id);

    return (
      <View>
        <TouchableOpacity
          style={[styles.varietyNode, variety.farms.length === 0 && styles.unavailableVariety]}
          onPress={() => {
            if (variety.farms.length > 0) {
              toggleVariety(variety.id);
              onVarietyPress?.(variety);
            }
          }}
        >
          <View style={styles.varietyContent}>
            <Text style={[styles.varietyEmoji, variety.farms.length === 0 && styles.unavailableText]}>{variety.emoji}</Text>
            <Text style={[styles.varietyName, variety.farms.length === 0 && styles.unavailableText]}>{variety.name}</Text>
            <Text style={[styles.farmCount, variety.farms.length === 0 && styles.unavailableText]}>{variety.farms.length} farms</Text>
            {variety.farms.length > 0 && (
              <TouchableOpacity 
                style={styles.magicAddButton}
                onPress={() => onVarietyPress?.(variety)}
              >
                <Sparkles size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <FlatList
            data={variety.farms}
            keyExtractor={(farm) => farm.id}
            contentContainerStyle={styles.farmList}
            renderItem={({ item: farm }) => (
              <TouchableOpacity
                style={styles.farmNode}
                onPress={() => onFarmPress?.(farm) || router.push(`/farm/${farm.id}`)}
              >
                <Image source={{ uri: farm.logo }} style={styles.farmLogo} />
                <View style={styles.farmInfo}>
                  <Text style={styles.farmName}>{farm.name}</Text>
                </View>
                <Text style={styles.farmPrice}>${farm.price?.toFixed(2) || '0.00'}</Text>
                <Text style={styles.farmLocation}>
                  {farm.location.city}, {farm.location.state}
                </Text>
                <ChevronRight size={16} style={styles.arrow} />
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.listTitle, { color: theme?.colors.text }]}>Varieties</Text>
        <View style={styles.pagination}>
          <TouchableOpacity 
            onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
          >
            <Text style={styles.paginationButtonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.paginationText}>{currentPage} / {totalPages}</Text>
          <TouchableOpacity 
            onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
          >
            <Text style={styles.paginationButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={paginatedData}
          keyExtractor={(variety) => variety.id}
          renderItem={renderVariety}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default VarietyFarmList;
