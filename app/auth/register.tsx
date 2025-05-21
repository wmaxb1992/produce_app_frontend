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
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import useThemeStore from '@/store/useThemeStore';
import useAuthStore from '@/store/useAuthStore';
import Button from '@/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { getThemeValues } = useThemeStore();
  const { colors } = getThemeValues();
  
  const { register, isLoading, error } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleRegister = async () => {
    // Basic validation
    if (!username.trim()) {
      setFormError('Username is required');
      return;
    }
    
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setFormError('Password is required');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    setFormError('');
    
    try {
      const result = await register(username, password, email);
      
      if (result.isSignUpComplete) {
        Alert.alert(
          "Registration Successful",
          "Your account has been created. You can now log in.",
          [{ text: "OK", onPress: () => router.push('/auth/login') }]
        );
      } else {
        // Need confirmation
        router.push({
          pathname: '/auth/confirm',
          params: { username }
        });
      }
    } catch (error: any) {
      // Error is already handled in the store
      console.log('Registration error in component:', error);
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Sign up to get started with Farm Fresh
          </Text>
        </View>
        
        <View style={styles.form}>
          {/* Username Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <User size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Username"
              placeholderTextColor={colors.subtext}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          
          {/* Email Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Mail size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
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
          
          {/* Confirm Password Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Lock size={20} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
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
          
          {/* Register Button */}
          <Button
            variant="primary"
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.registerButton}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              "Sign Up"
            )}
          </Button>
          
          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Sign In
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
  errorText: {
    fontSize: 14,
    marginBottom: 16,
  },
  registerButton: {
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