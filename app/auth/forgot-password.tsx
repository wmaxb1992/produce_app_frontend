import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useAuthStore from '@/store/useAuthStore';
import Button from '@/components/ui/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { getThemeValues } = useThemeStore();
  const { colors } = getThemeValues();
  
  const { forgotPassword, confirmForgotPassword, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState(1); // 1: Request code, 2: Confirm with code
  
  const handleRequestCode = async () => {
    // Basic validation
    if (!username.trim()) {
      setFormError('Username or email is required');
      return;
    }
    
    setFormError('');
    
    try {
      await forgotPassword(username);
      setStep(2);
    } catch (error: any) {
      // Error is already handled in the store
      console.log('Forgot password error in component:', error);
    }
  };
  
  const handleResetPassword = async () => {
    // Basic validation
    if (!code.trim()) {
      setFormError('Verification code is required');
      return;
    }
    
    if (!newPassword) {
      setFormError('New password is required');
      return;
    }
    
    if (newPassword.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    setFormError('');
    
    try {
      await confirmForgotPassword(username, code, newPassword);
      
      Alert.alert(
        "Password Reset Successful",
        "Your password has been reset. You can now log in with your new password.",
        [{ text: "OK", onPress: () => router.push('/auth/login') }]
      );
    } catch (error: any) {
      // Error is already handled in the store
      console.log('Reset password error in component:', error);
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
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            {step === 1 
              ? "Enter your username or email to receive a verification code" 
              : "Enter the verification code and your new password"}
          </Text>
        </View>
        
        <View style={styles.form}>
          {step === 1 ? (
            <>
              {/* Username/Email Input */}
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Mail size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Username or Email"
                  placeholderTextColor={colors.subtext}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              
              {/* Error Message */}
              {(formError || error) && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {formError || error}
                </Text>
              )}
              
              {/* Request Code Button */}
              <Button
                variant="primary"
                onPress={handleRequestCode}
                disabled={isLoading}
                style={styles.button}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Code Input */}
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Verification Code"
                  placeholderTextColor={colors.subtext}
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                />
              </View>
              
              {/* New Password Input */}
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Lock size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="New Password"
                  placeholderTextColor={colors.subtext}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.subtext} />
                  ) : (
                    <Eye size={20} color={colors.subtext} />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Confirm New Password Input */}
              <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Lock size={20} color={colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm New Password"
                  placeholderTextColor={colors.subtext}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
              
              {/* Error Message */}
              {(formError || error) && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {formError || error}
                </Text>
              )}
              
              {/* Reset Password Button */}
              <Button
                variant="primary"
                onPress={handleResetPassword}
                disabled={isLoading}
                style={styles.button}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  "Reset Password"
                )}
              </Button>
              
              {/* Back Button */}
              <Button
                variant="secondary"
                onPress={() => setStep(1)}
                style={styles.backButton}
              >
                Back
              </Button>
            </>
          )}
          
          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>
              Remember your password?
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
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    height: 56,
    marginBottom: 16,
  },
  backButton: {
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