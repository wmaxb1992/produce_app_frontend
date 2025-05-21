import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Calendar, MapPin, Clock, Users } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { formatDate } from '@/utils/formatters';

interface FarmEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  image?: string;
  capacity?: number;
  registeredCount?: number;
  price?: number;
  isFree?: boolean;
}

interface FarmEventsProps {
  events: FarmEvent[];
  onEventPress?: (event: FarmEvent) => void;
  style?: any;
}

export const FarmEvents = ({ events, onEventPress, style }: FarmEventsProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  if (!events || events.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Text style={styles.noEventsText}>No upcoming events at this time.</Text>
      </View>
    );
  }

  // Sort events by date (closest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Upcoming Events</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsScrollContent}
      >
        {sortedEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => onEventPress && onEventPress(event)}
            activeOpacity={0.8}
          >
            {event.image ? (
              <Image source={{ uri: event.image }} style={styles.eventImage} />
            ) : (
              <View style={styles.eventImagePlaceholder}>
                <Calendar size={32} color={theme.colors.gray[400]} />
              </View>
            )}
            
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
              
              <View style={styles.eventDetail}>
                <Calendar size={14} color={theme.colors.primary} style={styles.eventIcon} />
                <Text style={styles.eventDetailText}>{formatDate(event.date)}</Text>
              </View>
              
              <View style={styles.eventDetail}>
                <Clock size={14} color={theme.colors.primary} style={styles.eventIcon} />
                <Text style={styles.eventDetailText}>
                  {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
                </Text>
              </View>
              
              <View style={styles.eventDetail}>
                <MapPin size={14} color={theme.colors.primary} style={styles.eventIcon} />
                <Text style={styles.eventDetailText} numberOfLines={1}>{event.location}</Text>
              </View>
              
              <View style={styles.eventFooter}>
                {event.capacity && (
                  <View style={styles.capacityContainer}>
                    <Users size={14} color={theme.colors.text} style={styles.eventIcon} />
                    <Text style={styles.capacityText}>
                      {event.registeredCount || 0}/{event.capacity}
                    </Text>
                  </View>
                )}
                
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>
                    {event.isFree ? 'Free' : event.price ? `$${event.price.toFixed(2)}` : 'Free'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export const FarmEventDetail = ({ 
  event,
  onRegister,
  style,
}: { 
  event: FarmEvent,
  onRegister?: () => void,
  style?: any,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.eventDetailContainer, style]}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.eventDetailImage} />
      ) : (
        <View style={styles.eventDetailImagePlaceholder}>
          <Calendar size={48} color={theme.colors.gray[400]} />
        </View>
      )}
      
      <View style={styles.eventDetailContent}>
        <Text style={styles.eventDetailTitle}>{event.title}</Text>
        
        <View style={styles.eventDetailRow}>
          <Calendar size={18} color={theme.colors.primary} style={styles.eventDetailIcon} />
          <Text style={styles.eventDetailRowText}>{formatDate(event.date)}</Text>
        </View>
        
        <View style={styles.eventDetailRow}>
          <Clock size={18} color={theme.colors.primary} style={styles.eventDetailIcon} />
          <Text style={styles.eventDetailRowText}>
            {event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}
          </Text>
        </View>
        
        <View style={styles.eventDetailRow}>
          <MapPin size={18} color={theme.colors.primary} style={styles.eventDetailIcon} />
          <Text style={styles.eventDetailRowText}>{event.location}</Text>
        </View>
        
        {event.capacity && (
          <View style={styles.eventDetailRow}>
            <Users size={18} color={theme.colors.primary} style={styles.eventDetailIcon} />
            <Text style={styles.eventDetailRowText}>
              {event.registeredCount || 0} registered out of {event.capacity} spots
            </Text>
          </View>
        )}
        
        <View style={styles.eventPriceRow}>
          <Text style={styles.eventPriceLabel}>Price:</Text>
          <Text style={styles.eventPrice}>
            {event.isFree ? 'Free' : event.price ? `$${event.price.toFixed(2)}` : 'Free'}
          </Text>
        </View>
        
        <Text style={styles.eventDescription}>{event.description}</Text>
        
        {onRegister && (
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={onRegister}
          >
            <Text style={styles.registerButtonText}>Register Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    noEventsText: {
      fontSize: 16,
      color: theme.colors.gray[500],
      fontStyle: 'italic',
      textAlign: 'center',
      padding: 20,
    },
    eventsScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    eventCard: {
      width: 280,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    eventImage: {
      width: '100%',
      height: 140,
    },
    eventImagePlaceholder: {
      width: '100%',
      height: 140,
      backgroundColor: theme.colors.gray[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventContent: {
      padding: 12,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    eventDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    eventIcon: {
      marginRight: 6,
    },
    eventDetailText: {
      fontSize: 14,
      color: theme.colors.gray[600],
    },
    eventFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    capacityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    capacityText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    priceTag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    priceText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.primary,
    },
    eventDetailContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      marginVertical: 16,
    },
    eventDetailImage: {
      width: '100%',
      height: 200,
    },
    eventDetailImagePlaceholder: {
      width: '100%',
      height: 200,
      backgroundColor: theme.colors.gray[200],
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventDetailContent: {
      padding: 16,
    },
    eventDetailTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
    },
    eventDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    eventDetailIcon: {
      marginRight: 10,
    },
    eventDetailRowText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    eventPriceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    eventPriceLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginRight: 8,
    },
    eventPrice: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    eventDescription: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
      marginBottom: 20,
    },
    registerButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default FarmEvents;