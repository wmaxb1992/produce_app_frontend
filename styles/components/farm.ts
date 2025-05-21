import { StyleSheet } from 'react-native';
import defaultColors from '@/constants/colors';
import { padding, margin } from '../constants/spacing';
import { borderRadius } from '@/constants/theme';

export const farmStyles = StyleSheet.create({
  card: {
    backgroundColor: defaultColors.light.background,
    borderRadius: borderRadius.md,
    padding: padding.card,
    marginBottom: margin.sm,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margin.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    marginRight: margin.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultColors.light.text,
    marginBottom: margin.xs,
  },
  location: {
    fontSize: 14,
    color: defaultColors.light.textSecondary,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: margin.sm,
  },
  description: {
    fontSize: 14,
    color: defaultColors.light.text,
    marginBottom: margin.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: padding.sm,
    borderTopWidth: 1,
    borderTopColor: defaultColors.light.border,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: defaultColors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: defaultColors.light.textSecondary,
    marginTop: margin.xs,
  },
});
