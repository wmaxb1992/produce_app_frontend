import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import { searchBarStyles } from '@/styles/components/home/searchBar';

interface SearchBarProps {
  onPress: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onPress, 
  placeholder = 'Search for farms, products...' 
}) => {
  const { theme } = useThemeStore();
  const themeColors = theme?.colors || defaultColors.light;

  return (
    <TouchableOpacity
      style={[searchBarStyles.container, { backgroundColor: themeColors.card }]}
      onPress={onPress}
    >
      <Search size={20} color={themeColors.subtext} />
      <Text style={[searchBarStyles.text, { color: themeColors.subtext }]}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
};

export default SearchBar; 