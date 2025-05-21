import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@/store/useThemeStore';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.gray[400]}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
      width: '100%',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 6,
      color: theme.colors.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.gray[300],
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      height: 48,
      paddingHorizontal: 12,
      color: theme.colors.text,
      fontSize: 16,
    },
    iconLeft: {
      paddingLeft: 12,
    },
    iconRight: {
      paddingRight: 12,
    },
    helper: {
      fontSize: 14,
      color: theme.colors.gray[500],
      marginTop: 4,
    },
    error: {
      fontSize: 14,
      color: theme.colors.error,
      marginTop: 4,
    },
  });

export default Input;