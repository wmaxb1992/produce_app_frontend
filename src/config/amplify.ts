import { Amplify } from 'aws-amplify';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Configure Amplify
Amplify.configure({
  // Your AWS configuration will go here
  // You'll need to add your aws-exports.js file later
});

// Configure storage
Amplify.configure({
  Storage: {
    storage: AsyncStorage,
  },
});

// Configure network info
Amplify.configure({
  Network: {
    networkInfo: NetInfo,
  },
}); 