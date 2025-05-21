import { StyleSheet } from 'react-native';
import defaultColors from '@/constants/colors';
import { padding, margin } from '../constants/spacing';
import { borderRadius } from '@/constants/theme';

export const nestedListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.light.background,
  },
  varietyNode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.md,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.light.border,
    backgroundColor: defaultColors.light.card,
  },
  varietyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  varietyEmoji: {
    fontSize: 24,
    marginRight: margin.sm,
  },
  varietyName: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultColors.light.text,
    flex: 1,
  },
  farmNode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.md,
    paddingLeft: padding.xl, // Indent for nesting
    backgroundColor: defaultColors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.light.border,
  },
  farmLogo: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    marginRight: margin.sm,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: 14,
    fontWeight: '500',
    color: defaultColors.light.text,
  },
  farmLocation: {
    fontSize: 12,
    color: defaultColors.light.subtext,
  },
  arrow: {
    marginLeft: margin.sm,
  },
  nodeCount: {
    fontSize: 12,
    color: defaultColors.light.subtext,
    backgroundColor: defaultColors.light.secondary,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
    borderRadius: borderRadius.round,
  },
});
