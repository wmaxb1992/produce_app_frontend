// This file contains the AWS Amplify configuration
// Replace these values with your actual AWS Amplify resources after running 'amplify push'

const config = {
  // Auth configuration
  Auth: {
    // Amazon Cognito Region
    region: 'us-east-1',
    
    // Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_example',
    
    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: 'example',
    
    // Optional: OAuth configuration
    oauth: {
      domain: 'your-domain.auth.us-east-1.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code'
    }
  },
  
  // API configuration
  API: {
    // GraphQL endpoint
    GraphQL: {
      endpoint: 'https://example.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'AMAZON_COGNITO_USER_POOLS'
    },
    
    // REST endpoints
    REST: {
      farmFreshAPI: {
        endpoint: 'https://example.execute-api.us-east-1.amazonaws.com/dev',
        region: 'us-east-1'
      }
    }
  },
  
  // Storage configuration for S3
  Storage: {
    AWSS3: {
      bucket: 'farm-fresh-storage-example',
      region: 'us-east-1'
    }
  }
};

export default config;