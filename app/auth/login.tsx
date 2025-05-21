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
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useAuthStore from '@/store/useAuthStore';
import Button from '@/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { getThemeValues } = useThemeStore();
  const { colors } = getThemeValues();
  
  const { login, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  const handleLogin = async () => {
    // Basic validation
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    setFormError('');
    
    try {
      await login(username, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      // Error is already handled in the store
      console.log('Login error in component:', error);
    }
  };
  
  const navigateToRegister = () => {
    router.push('/auth/register');
  };
  
  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Sign in to your account to continue
          </Text>
        </View>
        
        <View style={styles.form}>
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
          
          {/* Password Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Lock size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
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
          
          {/* Forgot Password Link */}
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={navigateToForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {/* Error Message */}
          {(formError || error) && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {formError || error}
            </Text>
          )}
          
          {/* Login Button */}
          <Button
            variant="primary"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              "Sign In"
            )}
          </Button>
          
          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: colors.subtext }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    height: 56,
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});