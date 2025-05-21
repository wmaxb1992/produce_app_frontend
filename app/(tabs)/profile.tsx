import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  ShoppingBag, 
  Heart, 
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  LogIn,
  Calendar,
  Leaf,
  Flame,
  Snowflake,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import useUserStore from '@/store/useUserStore';
import useAuthStore from '@/store/useAuthStore';
import LoadingState from '@/components/ui/LoadingState';
import ThemeControls from '@/components/ui/ThemeControls';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, theme, season, isUsingSeasonalTheme } = useTheme();
  
  const { user: localUser, logout: logoutLocal } = useUserStore();
  const { 
    isAuthenticated, 
    user: authUser, 
    isLoading, 
    logout: logoutAmplify,
    fetchAttributes
  } = useAuthStore();
  
  const [userAttributes, setUserAttributes] = React.useState<any>(null);
  
  useEffect(() => {
    if (isAuthenticated && authUser) {
      fetchAttributes().then(attributes => {
        setUserAttributes(attributes);
      }).catch(error => {
        console.error('Error fetching user attributes:', error);
      });
    }
  }, [isAuthenticated, authUser]);
  
  const handleLogin = () => {
    router.push('/auth/login');
  };
  
  const handleLogout = async () => {
    try {
      // Logout from Amplify
      if (isAuthenticated) {
        await logoutAmplify();
      }
      
      // Also logout from local store
      logoutLocal();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <LoadingState message="Loading profile..." />
      </View>
    );
  }
  
  // If not authenticated with Amplify but have local user data
  const user = isAuthenticated ? authUser : localUser;
  const email = isAuthenticated && userAttributes ? userAttributes.email : localUser?.email;
  const name = isAuthenticated && userAttributes ? (userAttributes.name || userAttributes.email) : localUser?.name;
  
  // If not authenticated at all
  if (!isAuthenticated && !localUser) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <User size={64} color={colors.gray[300]} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Sign in to your account
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
          Access your orders, favorites, and settings
        </Text>
        <TouchableOpacity 
          style={[styles.signInButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={[styles.signInButtonText, { color: colors.white }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Get season icon and text
  const getSeasonIcon = () => {
    switch (season) {
      case 'spring':
        return <Leaf size={24} color="#fff" />;
      case 'summer':
        return <Sun size={24} color="#fff" />;
      case 'fall':
        return <Flame size={24} color="#fff" />;
      case 'winter':
        return <Snowflake size={24} color="#fff" />;
      default:
        return <Leaf size={24} color="#fff" />;
    }
  };

  const getSeasonText = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Seasonal Banner - only show when seasonal themes are enabled */}
      {isUsingSeasonalTheme && (
        <View style={[styles.seasonalBanner, { backgroundColor: colors.seasonal }]}>
          {getSeasonIcon()}
          <Text style={styles.seasonalText}>{getSeasonText()}</Text>
        </View>
      )}
    
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Image 
          source={{ uri: localUser?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }} 
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.subtext }]}>
            {email}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={[styles.editButtonText, { color: isUsingSeasonalTheme ? colors.seasonal : colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Theme Toggle - replaced with ThemeControls */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <ThemeControls />
      </View>
      
      {/* Account Settings */}
      <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
        ACCOUNT
      </Text>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.settingRow}>
          <View style={[styles.settingIconContainer, isUsingSeasonalTheme && { backgroundColor: colors.seasonal + '15' }]}>
            <MapPin size={20} color={isUsingSeasonalTheme ? colors.seasonal : colors.primary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Addresses
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={[styles.settingIconContainer, isUsingSeasonalTheme && { backgroundColor: colors.seasonal + '15' }]}>
            <CreditCard size={20} color={isUsingSeasonalTheme ? colors.seasonal : colors.primary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Payment Methods
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={[styles.settingIconContainer, isUsingSeasonalTheme && { backgroundColor: colors.seasonal + '15' }]}>
            <Settings size={20} color={isUsingSeasonalTheme ? colors.seasonal : colors.primary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Preferences
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
      
      {/* Orders & Favorites */}
      <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
        ACTIVITY
      </Text>
      
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push({pathname: '/orders'})}
        >
          <View style={styles.settingIconContainer}>
            <ShoppingBag size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Order History
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push({pathname: '/favorites'})}
        >
          <View style={styles.settingIconContainer}>
            <Heart size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            Favorites
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => router.push('/')}
        >
          <View style={styles.settingIconContainer}>
            <Calendar size={20} color={colors.secondary} />
          </View>
          <Text style={[styles.settingText, { color: colors.text }]}>
            My Subscriptions
          </Text>
          <ChevronRight size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
      
      {/* Logout */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={handleLogout}
        >
          <View style={styles.settingIconContainer}>
            <LogOut size={20} color={colors.error} />
          </View>
          <Text style={[styles.settingText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.versionText, { color: colors.subtext }]}>
        Version 1.0.0
      </Text>

      {isUsingSeasonalTheme && (
        <View style={styles.seasonFooter}>
          <Text style={[styles.seasonFooterText, { color: colors.seasonal }]}>
            Enjoying {season} with Farm Fresh Delivery!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  signInButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  section: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginLeft: 60,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 24,
  },
  seasonalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 16,
  },
  seasonalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  seasonFooter: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  seasonFooterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});