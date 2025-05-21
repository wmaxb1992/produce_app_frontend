import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/store/useThemeStore';
import { Rating } from '@/components/ui/Rating';
import { formatDate } from '@/utils/formatters';

interface ProductReviewProps {
  review: {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string;
    images?: string[];
    verified?: boolean;
  };
  style?: any;
}

export const ProductReview = ({ review, style }: ProductReviewProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {review.userAvatar ? (
            <Image source={{ uri: review.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {review.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>
        <Rating value={review.rating} size={16} readonly />
      </View>

      <Text style={styles.comment}>{review.comment}</Text>

      {review.images && review.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {review.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
        </View>
      )}

      {review.verified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>Verified Purchase</Text>
        </View>
      )}
    </View>
  );
};

export const ProductReviewsList = ({ 
  reviews,
  style
}: { 
  reviews: ProductReviewProps['review'][],
  style?: any
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.reviewsList, style]}>
      <Text style={styles.reviewsTitle}>Customer Reviews</Text>
      
      {reviews.length === 0 ? (
        <Text style={styles.noReviews}>No reviews yet. Be the first to review this product!</Text>
      ) : (
        reviews.map((review) => (
          <ProductReview key={review.id} review={review} style={styles.reviewItem} />
        ))
      )}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarInitial: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    userName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    reviewDate: {
      fontSize: 14,
      color: theme.colors.gray[500],
      marginTop: 2,
    },
    comment: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    imagesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    reviewImage: {
      width: 80,
      height: 80,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 8,
    },
    verifiedBadge: {
      backgroundColor: theme.colors.success + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    verifiedText: {
      color: theme.colors.success,
      fontSize: 12,
      fontWeight: '500',
    },
    reviewsList: {
      marginTop: 24,
    },
    reviewsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    reviewItem: {
      marginBottom: 16,
    },
    noReviews: {
      fontSize: 16,
      color: theme.colors.gray[500],
      fontStyle: 'italic',
      textAlign: 'center',
      padding: 20,
    },
  });

export default ProductReview;