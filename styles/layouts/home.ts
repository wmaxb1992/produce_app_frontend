import { StyleSheet } from 'react-native';
import defaultColors from '@/constants/colors';
import { padding, margin } from '../constants/spacing';
import { borderRadius } from '@/constants/theme';
import { typography } from '@/constants/typography';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultColors.light.background,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  addressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 0, // Removed gap
    paddingHorizontal: padding.md,

  },
  addressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.container,
    borderRadius: borderRadius.md,
    backgroundColor: defaultColors.light.spring,
    borderWidth: 0,
    marginRight: margin.sm,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding.container,
    borderRadius: borderRadius.md,
    marginTop: 0, // Removed gap
    marginBottom: margin.md,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
  },
  searchText: {
    marginLeft: margin.sm,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: margin.sm,
    color: defaultColors.light.text,
  },
  filterButton: {
    marginLeft: margin.sm,
  },
  sectionContent: {
    marginTop: 8,
  },
  section: {
    marginBottom: 0, // Removed gap
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  categoriesSectionHeader: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultColors.light.text,
    marginHorizontal: margin.md,
    marginBottom: margin.sm,
  },
  clearButton: {
    color: defaultColors.light.primary,
    padding: padding.section,
    borderRadius: 0,
    marginLeft: margin.sm,
    marginRight: margin.md,
    borderColor: defaultColors.light.border,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 0, // Removed gap
    paddingBottom: 0,
  },
  subcategoriesContainer: {
    flexDirection: 'row',
    marginBottom: 0, // Removed gap
    paddingHorizontal: padding.md,
  },
  subcategoryButton: {
    paddingHorizontal: padding.md,
    paddingVertical: padding.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
    marginRight: margin.sm,
    backgroundColor: defaultColors.light.card,
  },
  subcategoryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: defaultColors.light.text,
  },
  varietiesContainer: {
    flexDirection: 'row',
    marginBottom: 0, // Removed gap
    paddingHorizontal: padding.md,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: margin.sm,
  },
  paginationButton: {
    padding: padding.xs,
    borderRadius: borderRadius.round,
    backgroundColor: defaultColors.light.card,
    borderWidth: 1,
    borderColor: defaultColors.light.border,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    backgroundColor: defaultColors.light.background,
  },
  paginationText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: defaultColors.light.text,
  },
  carouselContainer: {
    flexDirection: 'row',
    marginBottom: margin.md,
    paddingHorizontal: padding.md,
  },
  featuredImage: {
    width: '100%',
    height: 144,
    resizeMode: 'cover',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingTop: padding.md,
  },
  bannerContainer: {
    marginHorizontal: margin.md,
    marginBottom: margin.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  bannerBackground: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  bannerContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: padding.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerTextContent: {
    flex: 1,
  },
  bannerTitle: {
    color: defaultColors.light.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 0, // Removed gap
  },
  bannerSubtitle: {
    color: defaultColors.light.white,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: margin.md,
  },
  bannerButton: {
    backgroundColor: defaultColors.light.primary,
    paddingVertical: padding.sm,
    paddingHorizontal: padding.md,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: defaultColors.light.white,
    fontSize: 14,
    fontWeight: '600',
  },
  floatingHomeButton: {
    position: 'absolute',
    right: padding.md,
    bottom: margin.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Important for blur to work properly
    zIndex: 1000,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
  buttonContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: defaultColors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingTopRightButton: {
    position: 'absolute',
    top: 50,  // Increased to avoid status bar
    right: padding.md,
    width: 51,
    height: 51,
    borderRadius: 25.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Important for blur to work properly
    zIndex: 9999,  // Higher z-index to ensure it's above everything
  },
});
