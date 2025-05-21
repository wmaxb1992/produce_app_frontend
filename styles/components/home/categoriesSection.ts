import { StyleSheet } from 'react-native';

export const categoriesSectionStyles = StyleSheet.create({
  section: {
    marginBottom: 14, // Increased from 4px to 14px to add 10px more space
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  clearButton: {
    padding: 6,
    borderRadius: 8,
    marginLeft: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 0,
  },
}); 