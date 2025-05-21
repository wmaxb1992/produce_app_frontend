import { StyleSheet } from 'react-native';

export const farmsSectionStyles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  farmsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  farmContentContainer: {
    paddingHorizontal: 6,
    gap: 16,
  },
}); 