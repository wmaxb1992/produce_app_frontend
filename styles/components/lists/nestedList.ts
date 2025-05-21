import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';
import defaultColors from '@/constants/colors';

export const nestedListStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 3,
    borderTopColor: colors.border,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  listTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semibold,
    color: colors.text,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paginationButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: defaultColors.light.spring,
    borderRadius: borderRadius.sm,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: defaultColors.light.white,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
  },
  paginationText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: spacing.sm,
  },
  varietyNode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    minWidth: 120,
    height: 44,
  },
  unavailableVariety: {
    backgroundColor: `${colors.card}CC`,  // Add 80% opacity
    opacity: 0.8,
  },
  unavailableText: {
    fontStyle: 'italic',
    color: colors.subtext,
  },
  varietyContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  varietyEmoji: {
    fontSize: typography.sizes.xl,
    marginRight: spacing.sm,
  },
  varietyName: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text,
    flex: 1,
  },
  farmCount: {
    fontSize: typography.sizes.xs,
    color: colors.subtext,
    marginRight: spacing.sm,
  },
  magicAddButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  farmNode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.xl,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 40,
  },
  farmLogo: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: typography.sizes.sm,
  },
  farmPrice: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  farmLocation: {
    fontSize: typography.sizes.xs,
    color: colors.subtext,
  },
  arrow: {
    marginLeft: spacing.sm,
  },
  nodeCount: {
    fontSize: typography.sizes.xs,
    color: colors.subtext,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginLeft: spacing.sm,
  },
  listContainer: {
    flexGrow: 0,
  },
  farmList: {
    flexGrow: 0,
  },
});
