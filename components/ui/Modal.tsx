import React from 'react';
import { View, Text, StyleSheet, Modal as RNModal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/store/useThemeStore';
import Button from './Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal = ({
  visible,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
}: ModalProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.container}>
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {showCloseButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <X size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.content}>{children}</View>
              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

export const ConfirmationModal = ({
  visible,
  onClose,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isDestructive = false,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      footer={
        <View style={styles.confirmationFooter}>
          <Button 
            title={cancelText} 
            onPress={onClose} 
            variant="outline"
            style={styles.cancelButton}
          />
          <Button 
            title={confirmText} 
            onPress={() => {
              onConfirm();
              onClose();
            }} 
            variant={isDestructive ? "danger" : "primary"}
          />
        </View>
      }
    >
      <Text style={styles.confirmationMessage}>{message}</Text>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      maxWidth: 500,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      padding: 20,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray[200],
    },
    confirmationFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    cancelButton: {
      minWidth: 100,
    },
    confirmationMessage: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 8,
    },
  });

export default Modal;