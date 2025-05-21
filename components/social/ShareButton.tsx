import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { Share2, Copy, Facebook, Twitter, Instagram, Link } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { Modal } from '@/components/ui/Modal';

interface ShareButtonProps {
  title: string;
  message: string;
  url: string;
  onShare?: () => void;
  style?: any;
}

export const ShareButton = ({
  title,
  message,
  url,
  onShare,
  style,
}: ShareButtonProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web fallback - show modal with share options
        setModalVisible(true);
      } else {
        // Native share dialog
        const result = await Share.share({
          title,
          message: `${message} ${url}`,
          url, // iOS only
        });
        
        if (result.action === Share.sharedAction) {
          if (onShare) onShare();
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = () => {
    // In a real app, you would use Clipboard.setString(url)
    // For this example, we'll just close the modal
    setModalVisible(false);
    if (onShare) onShare();
  };

  const handleSocialShare = (platform: string) => {
    // In a real app, you would open the respective social media app or web page
    console.log(`Sharing to ${platform}`);
    setModalVisible(false);
    if (onShare) onShare();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.shareButton, style]}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Share2 size={20} color={theme.colors.primary} />
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Share"
      >
        <View style={styles.modalContent}>
          <Text style={styles.shareTitle}>{title}</Text>
          <Text style={styles.shareMessage} numberOfLines={2}>
            {message}
          </Text>
          
          <View style={styles.shareOptions}>
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleSocialShare('facebook')}
            >
              <View style={[styles.shareIconContainer, styles.facebookColor]}>
                <Facebook size={24} color="#fff" />
              </View>
              <Text style={styles.shareOptionText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleSocialShare('twitter')}
            >
              <View style={[styles.shareIconContainer, styles.twitterColor]}>
                <Twitter size={24} color="#fff" />
              </View>
              <Text style={styles.shareOptionText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.shareOption}
              onPress={() => handleSocialShare('instagram')}
            >
              <View style={[styles.shareIconContainer, styles.instagramColor]}>
                <Instagram size={24} color="#fff" />
              </View>
              <Text style={styles.shareOptionText}>Instagram</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.copyLinkButton}
            onPress={handleCopyLink}
          >
            <Link size={20} color={theme.colors.primary} style={styles.copyIcon} />
            <Text style={styles.copyLinkText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '15',
    },
    shareText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
      marginLeft: 6,
    },
    modalContent: {
      padding: 8,
    },
    shareTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    shareMessage: {
      fontSize: 14,
      color: theme.colors.gray[600],
      marginBottom: 20,
    },
    shareOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
    },
    shareOption: {
      alignItems: 'center',
    },
    shareIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    facebookColor: {
      backgroundColor: '#1877F2',
    },
    twitterColor: {
      backgroundColor: '#1DA1F2',
    },
    instagramColor: {
      backgroundColor: '#E4405F',
    },
    shareOptionText: {
      fontSize: 12,
      color: theme.colors.text,
    },
    copyLinkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
    },
    copyIcon: {
      marginRight: 8,
    },
    copyLinkText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.primary,
    },
  });

export default ShareButton;