import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import defaultColors from '@/constants/colors';
import { homeStyles } from '@/styles/layouts/home';

interface SearchBarProps {
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({ style }) => {
  const router = useRouter();
  const themeStore = useThemeStore();
  const theme = themeStore.getThemeValues ? themeStore.getThemeValues() : { colors: defaultColors.light };
  const themeColors = theme.colors || defaultColors.light;

  return (
    <TouchableOpacity
      style={[homeStyles.searchBar, { backgroundColor: themeColors.card }, style]}
      onPress={() => router.push('/search')}
    >
      <Search size={20} color={themeColors.subtext} />
      <Text style={[homeStyles.searchText, { color: themeColors.subtext }]}>
        Search for farms, products...
      </Text>
    </TouchableOpacity>
  );
};

export default SearchBar;
