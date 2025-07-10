import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  Star,
  Heart,
  ChevronLeft,
  Share2,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import useFarmStore from '@/store/useFarmStore';
import useProductStore from '@/store/useProductStore';
import useUserStore from '@/store/useUserStore';
import ProductCard from '@/components/product/ProductCard';
import FarmPostCard from '@/components/farm/FarmPostCard';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';

const { width } = Dimensions.get('window');

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const { getFarmById, getPostsByFarmId, isFollowingFarm, followFarm, unfollowFarm } = useFarmStore();
  const { getProductsByFarmId } = useProductStore();
  const { user } = useUserStore();
  
  const [activeTab, setActiveTab] = React.useState<'products' | 'about' | 'posts'>('products');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  const farm = getFarmById(id);
  const farmProducts = farm ? getProductsByFarmId(farm.id) : [];
  const farmPosts = farm ? getPostsByFarmId(farm.id) : [];
  
  const isFollowing = farm ? isFollowingFarm(farm.id) : false;
  
  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading farm details..." />
      </View>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState 
          message="Could not load farm details" 
          onRetry={() => router.reload()}
        />
      </View>
    );
  }
  
  if (!farm) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.text }]}>
          Farm not found
        </Text>
        <Button
          variant="primary"
          onPress={() => router.back()}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  const toggleFollow = () => {
    if (isFollowing) {
      unfollowFarm(farm.id);
    } else {
      followFarm(farm.id);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
            >
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Cover Image */}
        <Image 
          source={{ uri: farm.coverImage }} 
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        {/* Farm Info */}
        <View style={styles.infoContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: farm.logo }} 
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.text }]}>
              {farm.name}
            </Text>
            
            <View style={styles.locationRow}>
              <MapPin size={16} color={colors.subtext} />
              <Text style={[styles.location, { color: colors.subtext }]}>
                {farm.location.city}, {farm.location.state}
              </Text>
            </View>
            
            <View style={styles.ratingRow}>
              <Star size={16} color={colors.secondary} fill={colors.secondary} />
              <Text style={[styles.rating, { color: colors.text }]}>
                {farm.rating.toFixed(1)} ({farm.reviewCount} reviews)
              </Text>
            </View>
          </View>
          
          <Button
            variant={isFollowing ? 'outline' : 'primary'}
            size="md"
            style={styles.followButton}
            leftIcon={<Heart size={16} color={isFollowing ? colors.primary : colors.white} />}
            onPress={toggleFollow}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        </View>
        
        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'products' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('products')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'products' ? colors.primary : colors.subtext }
              ]}
            >
              Products
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'about' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('about')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'about' ? colors.primary : colors.subtext }
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'posts' && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab('posts')}
          >
            <Text 
              style={[
                styles.tabText, 
                { color: activeTab === 'posts' ? colors.primary : colors.subtext }
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {activeTab === 'products' && (
          <View style={styles.productsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Products from {farm.name}
            </Text>
            
            <View style={styles.productsGrid}>
              {farmProducts.map((product) => (
                <View key={product.id} style={styles.productItem}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </View>
        )}
        
        {activeTab === 'about' && (
          <View style={styles.aboutContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About {farm.name}
            </Text>
            
            <Text style={[styles.description, { color: colors.text }]}>
              {farm.description}
            </Text>
            
            <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                Certifications
              </Text>
              <View style={styles.certificationsContainer}>
                {farm.certifications.map((cert, index) => (
                  <View 
                    key={index} 
                    style={[styles.certificationBadge, { backgroundColor: colors.gray[100] }]}
                  >
                    <Award size={16} color={colors.secondary} />
                    <Text style={[styles.certificationText, { color: colors.text }]}>
                      {cert}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                Specialties
              </Text>
              <View style={styles.specialtiesContainer}>
                {farm.specialties.map((specialty, index) => (
                  <Text key={index} style={[styles.specialtyText, { color: colors.text }]}>
                    • {specialty}
                  </Text>
                ))}
              </View>
            </View>
            
            <View style={[styles.infoSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                Contact Information
              </Text>
              <View style={styles.contactContainer}>
                <View style={styles.contactItem}>
                  <Phone size={16} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    {farm.contactInfo.phone}
                  </Text>
                </View>
                
                <View style={styles.contactItem}>
                  <Mail size={16} color={colors.primary} />
                  <Text style={[styles.contactText, { color: colors.text }]}>
                    {farm.contactInfo.email}
                  </Text>
                </View>
                
                {farm.contactInfo.website && (
                  <View style={styles.contactItem}>
                    <Globe size={16} color={colors.primary} />
                    <Text style={[styles.contactText, { color: colors.text }]}>
                      {farm.contactInfo.website}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {farm.socialMedia && Object.keys(farm.socialMedia).length > 0 && (
              <View style={styles.infoSection}>
                <Text style={[styles.infoSectionTitle, { color: colors.text }]}>
                  Social Media
                </Text>
                <View style={styles.socialContainer}>
                  {farm.socialMedia.instagram && (
                    <TouchableOpacity style={styles.socialItem}>
                      <Instagram size={20} color={colors.text} />
                      <Text style={[styles.socialText, { color: colors.text }]}>
                        {farm.socialMedia.instagram}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {farm.socialMedia.facebook && (
                    <TouchableOpacity style={styles.socialItem}>
                      <Facebook size={20} color={colors.text} />
                      <Text style={[styles.socialText, { color: colors.text }]}>
                        {farm.socialMedia.facebook}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {farm.socialMedia.twitter && (
                    <TouchableOpacity style={styles.socialItem}>
                      <Twitter size={20} color={colors.text} />
                      <Text style={[styles.socialText, { color: colors.text }]}>
                        {farm.socialMedia.twitter}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'posts' && (
          <View style={styles.postsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Latest Updates from {farm.name}
            </Text>
            
            {farmPosts.length > 0 ? (
              farmPosts.map((post) => (
                <FarmPostCard key={post.id} post={post} />
              ))
            ) : (
              <View style={styles.emptyPostsContainer}>
                <Text style={[styles.emptyPostsText, { color: colors.text }]}>
                  No posts yet from this farm
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  coverImage: {
    width: width,
    height: 200,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
    marginTop: -40,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  followButton: {
    minWidth: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  productsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productItem: {
    width: '48%',
    marginBottom: 16,
  },
  aboutContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  infoSection: {
    paddingBottom: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  certificationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  specialtiesContainer: {
    
  },
  specialtyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  contactContainer: {
    
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 8,
  },
  socialContainer: {
    
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialText: {
    fontSize: 16,
    marginLeft: 8,
  },
  postsContainer: {
    padding: 16,
  },
  emptyPostsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyPostsText: {
    fontSize: 16,
  },
});