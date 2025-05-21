import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Initialize Amplify with your configuration
export function configureAmplify() {
  // Replace these values with your actual Amplify configuration from AWS Console
  const awsConfig = {
    Auth: {
      Cognito: {
        // Get these values from your AWS Cognito Console
        userPoolId: 'us-east-1_example', // Replace with your User Pool ID
        userPoolClientId: 'example', // Replace with your App Client ID
        signUpVerificationMethod: 'code', // 'code' | 'link'
        loginWith: {
          email: true,
          phone: true,
          username: false
        },
        mfa: {
          status: 'optional' // 'optional' | 'required' | 'off'
        }
      }
    },
    API: {
      GraphQL: {
        // Get these values from your AWS AppSync Console
        endpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql', // Replace with your AppSync endpoint
        region: 'us-east-1', // Replace with your region
        defaultAuthMode: 'userPool' // Use Cognito User Pool as default auth
      },
      REST: {
        farmFreshAPI: {
          endpoint: 'https://example.execute-api.us-east-1.amazonaws.com/dev', // Replace with your API Gateway URL
          region: 'us-east-1' // Replace with your region
        }
      }
    },
    Storage: {
      S3: {
        bucket: 'your-s3-bucket-name', // Replace with your S3 bucket name
        region: 'us-east-1' // Replace with your region
      }
    }
  };

  Amplify.configure(awsConfig);

  // Set up token refresh handling with appropriate storage for each platform
  cognitoUserPoolsTokenProvider.setKeyValueStorage({
    setItem: async (key: string, value: string) => {
      try {
        if (Platform.OS === 'web') {
          localStorage.setItem(key, value);
        } else {
          await AsyncStorage.setItem(key, value);
        }
      } catch (error) {
        console.log('Error setting auth tokens in storage', error);
      }
    },
    getItem: async (key: string) => {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        } else {
          return await AsyncStorage.getItem(key);
        }
      } catch (error) {
        console.log('Error getting auth tokens from storage', error);
        return null;
      }
    },
    removeItem: async (key: string) => {
      try {
        if (Platform.OS === 'web') {
          localStorage.removeItem(key);
        } else {
          await AsyncStorage.removeItem(key);
        }
      } catch (error) {
        console.log('Error removing auth tokens from storage', error);
      }
    },
    clear: async () => {
      try {
        if (Platform.OS === 'web') {
          localStorage.clear();
        } else {
          await AsyncStorage.clear();
        }
      } catch (error) {
        console.log('Error clearing auth tokens from storage', error);
      }
    }
  });
}