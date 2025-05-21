import { StyleSheet } from 'react-native';
import defaultColors from '@/constants/colors';
import { padding, margin } from '../constants/spacing';
import { borderRadius } from '@/constants/theme';

export const productStyles = StyleSheet.create({
  card: {
    backgroundColor: defaultColors.light.background,
    borderRadius: borderRadius.md,
    padding: padding.card,
    marginBottom: margin.sm,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.sm,
    marginBottom: margin.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultColors.light.text,
    marginBottom: margin.xs,
  },
  price: {
    fontSize: 14,
    color: defaultColors.light.primary,
    marginBottom: margin.xs,
  },
  description: {
    fontSize: 14,
    color: defaultColors.light.subtext,
    marginBottom: margin.sm,
  },
  varietyChip: {
    backgroundColor: defaultColors.light.secondary,
    borderRadius: borderRadius.round,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
    marginRight: margin.xs,
    marginBottom: margin.xs,
  },
  varietyText: {
    fontSize: 12,
    color: defaultColors.light.subtext,
  },
  varietyCard: {
    backgroundColor: defaultColors.light.card,
    borderRadius: borderRadius.md,
    padding: padding.md,
    marginRight: margin.sm,
    alignItems: 'center',
    minWidth: 80,
  },
  varietyEmoji: {
    fontSize: 24,
    marginBottom: margin.xs,
  },
  varietyName: {
    fontSize: 12,
    color: defaultColors.light.text,
    textAlign: 'center',
  },
  seasonalBadge: {
    position: 'absolute',
    top: margin.xs,
    right: margin.xs,
    backgroundColor: defaultColors.light.primary,
    borderRadius: borderRadius.round,
    paddingHorizontal: padding.sm,
    paddingVertical: padding.xs,
  },
  seasonalText: {
    fontSize: 12,
    color: defaultColors.light.background,
    fontWeight: '600',
  },
});
