import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

interface FarmStoryProps {
  farm: {
    id: string;
    name: string;
    foundedYear: number;
    story: string;
    storyImages?: string[];
    familyOwned?: boolean;
    generation?: number;
  };
  initialExpanded?: boolean;
  style?: any;
}

export const FarmStory = ({
  farm,
  initialExpanded = false,
  style,
}: FarmStoryProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(initialExpanded);

  const truncatedStory = farm.story.length > 150
    ? farm.story.substring(0, 150) + '...'
    : farm.story;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Story</Text>
        {farm.familyOwned && (
          <View style={styles.familyOwnedBadge}>
            <Text style={styles.familyOwnedText}>
              {farm.generation ? `${farm.generation}${getOrdinalSuffix(farm.generation)} Generation` : 'Family Owned'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.foundedRow}>
        <Text style={styles.foundedText}>Est. {farm.foundedYear}</Text>
      </View>

      <Text style={styles.storyText}>
        {expanded ? farm.story : truncatedStory}
      </Text>

      {farm.story.length > 150 && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={styles.expandButtonText}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>
          {expanded ? (
            <ChevronUp size={16} color={theme.colors.primary} />
          ) : (
            <ChevronDown size={16} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      )}

      {expanded && farm.storyImages && farm.storyImages.length > 0 && (
        <View style={styles.imagesContainer}>
          {farm.storyImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.storyImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      marginVertical: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },
    familyOwnedBadge: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 16,
    },
    familyOwnedText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
    foundedRow: {
      marginBottom: 12,
    },
    foundedText: {
      fontSize: 14,
      color: theme.colors.gray[500],
      fontStyle: 'italic',
    },
    storyText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    expandButtonText: {
      color: theme.colors.primary,
      fontWeight: '500',
      marginRight: 4,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 16,
      gap: 8,
    },
    storyImage: {
      width: '48%',
      height: 120,
      borderRadius: 8,
    },
  });

export default FarmStory;