import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useAuthStore from '@/store/useAuthStore';
import Button from '@/components/ui/Button';

export default function ConfirmRegistrationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const username = params.username as string;
  
  const { getThemeValues } = useThemeStore();
  const { colors } = getThemeValues();
  
  const { confirmRegistration, isLoading, error } = useAuthStore();
  
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    if (!username) {
      Alert.alert(
        "Error",
        "No username provided. Please go back and try again.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  }, [username]);
  
  const handleConfirm = async () => {
    // Basic validation
    if (!code.trim()) {
      setFormError('Verification code is required');
      return;
    }
    
    setFormError('');
    
    try {
      const result = await confirmRegistration(username, code);
      
      if (result.isSignUpComplete) {
        Alert.alert(
          "Verification Successful",
          "Your account has been verified. You can now log in.",
          [{ text: "OK", onPress: () => router.push('/auth/login') }]
        );
      }
    } catch (error: any) {
      // Error is already handled in the store
      console.log('Confirmation error in component:', error);
    }
  };
  
  const navigateToLogin = () => {
    router.push('/auth/login');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Verify Your Account</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            We've sent a verification code to your email. Please enter it below.
          </Text>
        </View>
        
        <View style={styles.form}>
          {/* Code Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Verification Code"
              placeholderTextColor={colors.subtext}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
            />
          </View>
          
          {/* Error Message */}
          {(formError || error) && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {formError || error}
            </Text>
          )}
          
          {/* Confirm Button */}
          <Button
            variant="primary"
            onPress={handleConfirm}
            disabled={isLoading}
            style={styles.confirmButton}
            leftIcon={<CheckCircle size={18} color={colors.white} />}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              "Verify Account"
            )}
          </Button>
          
          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>
              Already verified?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  confirmButton: {
    height: 56,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});