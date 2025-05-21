import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Modal,
  Text
} from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageGalleryProps {
  images: string[];
  height?: number;
  showThumbnails?: boolean;
  style?: any;
}

export const ImageGallery = ({
  images,
  height = 300,
  showThumbnails = true,
  style,
}: ImageGalleryProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, height);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const modalScrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
    }
    setActiveIndex(index);
  };

  const scrollToModalImage = (index: number) => {
    if (modalScrollViewRef.current) {
      modalScrollViewRef.current.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
    }
    setActiveIndex(index);
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      scrollToModalImage(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) {
      scrollToModalImage(activeIndex + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </TouchableOpacity>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
            onPress={() => scrollToImage(index)}
          />
        ))}
      </View>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailsContainer}
          contentContainerStyle={styles.thumbnailsContent}
        >
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToImage(index)}
              style={[
                styles.thumbnailButton,
                index === activeIndex && styles.thumbnailButtonActive,
              ]}
            >
              <Image
                source={{ uri: image }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Fullscreen Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.modalImageContainer}>
            <ScrollView
              ref={modalScrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>
            
            {/* Navigation arrows */}
            {activeIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={handlePrevious}
              >
                <ChevronLeft size={32} color="#fff" />
              </TouchableOpacity>
            )}
            
            {activeIndex < images.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={handleNext}
              >
                <ChevronRight size={32} color="#fff" />
              </TouchableOpacity>
            )}
            
            {/* Image counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeIndex + 1} / {images.length}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any, height: number) =>
  StyleSheet.create({
    container: {
      height,
      width: '100%',
      borderRadius: 8,
      overflow: 'hidden',
    },
    image: {
      width: SCREEN_WIDTH,
      height,
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: showThumbnails ? 70 : 16,
      alignSelf: 'center',
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: '#fff',
    },
    thumbnailsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    thumbnailsContent: {
      paddingHorizontal: 8,
      alignItems: 'center',
      height: 60,
    },
    thumbnailButton: {
      width: 48,
      height: 48,
      marginHorizontal: 4,
      borderRadius: 4,
      overflow: 'hidden',
      opacity: 0.7,
    },
    thumbnailButtonActive: {
      opacity: 1,
      borderWidth: 2,
      borderColor: '#fff',
    },
    thumbnail: {
      width: '100%',
      height: '100%',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      justifyContent: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
      padding: 8,
    },
    modalImageContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    modalImage: {
      width: SCREEN_WIDTH,
      height: '100%',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      marginTop: -25,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    navButtonLeft: {
      left: 10,
    },
    navButtonRight: {
      right: 10,
    },
    imageCounter: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    imageCounterText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '500',
    },
  });

export default ImageGallery;