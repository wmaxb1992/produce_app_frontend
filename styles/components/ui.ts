import { StyleSheet } from 'react-native';
import defaultColors from '@/constants/colors';
import { padding, margin } from '../constants/spacing';
import { borderRadius } from '@/constants/theme';

export const uiStyles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.container,
    borderRadius: borderRadius.md,
    marginTop: margin.sm,
    marginBottom: margin.md,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: margin.sm,
    color: defaultColors.light.text,
  },
  filterButton: {
    marginLeft: margin.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: padding.container,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultColors.light.text,
    marginBottom: margin.sm,
  },
  clearButton: {
    color: defaultColors.light.primary,
    padding: padding.xs,
  },
  chip: {
    backgroundColor: defaultColors.light.backgroundSecondary,
    borderRadius: borderRadius.full,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
    marginRight: margin.xs,
    marginBottom: margin.xs,
  },
  chipText: {
    fontSize: 12,
    color: defaultColors.light.textSecondary,
  },
  badge: {
    position: 'absolute',
    backgroundColor: defaultColors.light.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
  },
  badgeText: {
    fontSize: 12,
    color: defaultColors.light.background,
    fontWeight: '600',
  },
});
