import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Info } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import { Modal } from '@/components/ui/Modal';

interface Certification {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FarmCertificationsProps {
  certifications: Certification[];
  style?: any;
}

export const FarmCertifications = ({ certifications, style }: FarmCertificationsProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedCert, setSelectedCert] = React.useState<Certification | null>(null);

  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Certifications</Text>
      <View style={styles.certificationsRow}>
        {certifications.map((cert) => (
          <TouchableOpacity
            key={cert.id}
            style={styles.certificationItem}
            onPress={() => setSelectedCert(cert)}
          >
            <Image source={{ uri: cert.icon }} style={styles.certIcon} />
            <Text style={styles.certName}>{cert.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        visible={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title={selectedCert?.name}
      >
        {selectedCert && (
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedCert.icon }} style={styles.modalIcon} />
            <Text style={styles.modalDescription}>{selectedCert.description}</Text>
          </View>
        )}
      </Modal>
    </View>
  );
};

export const CertificationBadge = ({ 
  certification,
  size = 'medium',
  showName = true,
  style,
}: { 
  certification: Certification,
  size?: 'small' | 'medium' | 'large',
  showName?: boolean,
  style?: any,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = React.useState(false);
  
  const sizeMap = {
    small: { icon: 24, container: styles.badgeSmall },
    medium: { icon: 32, container: styles.badgeMedium },
    large: { icon: 40, container: styles.badgeLarge },
  };
  
  return (
    <>
      <TouchableOpacity 
        style={[sizeMap[size].container, style]} 
        onPress={() => setModalVisible(true)}
      >
        <Image 
          source={{ uri: certification.icon }} 
          style={[styles.badgeIcon, { width: sizeMap[size].icon, height: sizeMap[size].icon }]} 
        />
        {showName && <Text style={styles.badgeName}>{certification.name}</Text>}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={certification.name}
      >
        <View style={styles.modalContent}>
          <Image source={{ uri: certification.icon }} style={styles.modalIcon} />
          <Text style={styles.modalDescription}>{certification.description}</Text>
        </View>
      </Modal>
    </>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    certificationsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -8,
    },
    certificationItem: {
      alignItems: 'center',
      padding: 12,
      margin: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      minWidth: 100,
    },
    certIcon: {
      width: 40,
      height: 40,
      marginBottom: 8,
    },
    certName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
    },
    modalContent: {
      alignItems: 'center',
    },
    modalIcon: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    modalDescription: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
      textAlign: 'center',
    },
    badgeSmall: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
      borderRadius: 6,
      backgroundColor: theme.colors.card,
    },
    badgeMedium: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
    },
    badgeLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.colors.card,
    },
    badgeIcon: {
      marginRight: 8,
    },
    badgeName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
  });

export default FarmCertifications;