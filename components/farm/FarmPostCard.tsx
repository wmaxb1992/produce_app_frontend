import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Share } from 'lucide-react-native';
import { FarmPost } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import Card from '@/components/ui/Card';

interface FarmPostCardProps {
  post: FarmPost;
  onPress?: () => void;
}

const FarmPostCard: React.FC<FarmPostCardProps> = ({ post, onPress }) => {
  const { colors } = useTheme();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: post.farmLogo }} 
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <Text style={[styles.farmName, { color: colors.text }]}>
              {post.farmName}
            </Text>
            <Text style={[styles.date, { color: colors.subtext }]}>
              {formatDate(post.createdAt)}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.content, { color: colors.text }]}>
          {post.content}
        </Text>
        
        {post.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {post.images.length === 1 ? (
              <Image 
                source={{ uri: post.images[0] }} 
                style={styles.singleImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.multipleImagesContainer}>
                {post.images.slice(0, 3).map((image, index) => (
                  <Image 
                    key={index}
                    source={{ uri: image }} 
                    style={[
                      styles.multipleImage,
                      index === 2 && post.images.length > 3 && styles.lastImage,
                    ]}
                    resizeMode="cover"
                  />
                ))}
                {post.images.length > 3 && (
                  <View style={[
                    styles.moreImagesOverlay, 
                    { backgroundColor: colors.black + '80' }
                  ]}>
                    <Text style={[styles.moreImagesText, { color: colors.white }]}>
                      +{post.images.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
        
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Text 
              key={index} 
              style={[styles.tag, { color: colors.primary }]}
            >
              #{tag}
            </Text>
          ))}
        </View>
        
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color={colors.subtext} />
            <Text style={[styles.actionText, { color: colors.subtext }]}>
              {post.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={colors.subtext} />
            <Text style={[styles.actionText, { color: colors.subtext }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContent: {
    marginLeft: 12,
  },
  farmName: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    marginBottom: 12,
  },
  singleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  multipleImagesContainer: {
    flexDirection: 'row',
    height: 120,
    gap: 4,
  },
  multipleImage: {
    flex: 1,
    borderRadius: 8,
  },
  lastImage: {
    position: 'relative',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '33%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    fontSize: 14,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
});

export default FarmPostCard;