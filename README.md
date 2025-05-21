# Farm Fresh Delivery App

A React Native mobile app for ordering fresh produce directly from local farms.

## Theme System

The app implements a standardized theme system to ensure visual consistency throughout the app.

### Key Components

1. **Theme Hook**
   - `hooks/useTheme.ts` - Centralized hook that safely accesses theme values from the store

2. **UI Components**
   - `LoadingState` - Consistent loading spinner with theme-aware styling
   - `ErrorState` - Standardized error display with retry functionality
   - `ThemeToggle` - A toggle switch for changing between light and dark themes
   - `Button` - Flexible button component that adapts to the current theme
   - `Card` - A container component with different variants (elevated, outlined, filled)
   - `Badge` - Label component for tags and status indicators

3. **Screens**
   - All screens now use the centralized theme system with proper styling
   - Consistent UI patterns across the app

### Implementation Details

The theme system follows these principles:

1. **Single Source of Truth**
   - Theme values are stored in `constants/colors.ts` and managed by `store/useThemeStore.ts`
   - Components access theme via the `useTheme` hook

2. **Type Safety**
   - All theme values have proper TypeScript interfaces in `types/index.ts`
   - Components are properly typed to work with the theme system

3. **Resilience**
   - The theme system includes error handling and fallback values
   - Components gracefully handle undefined theme values

4. **Accessibility**
   - Dark mode support built into the theme system
   - Color contrast ratios meet accessibility guidelines

## Development Process

1. **Current Status**
   - Core UI components have been updated to use the theme system
   - Main screens have been converted
   - TypeScript errors have been fixed

2. **Next Steps**
   - Continue converting remaining components
   - Add custom themes beyond light/dark
   - Implement theme persistence

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npx expo start`

## Setting Up AWS Amplify and Seeding Data

This guide will walk you through setting up AWS Amplify for your Farm Fresh app and seeding it with mock data.

### Prerequisites

- Node.js and npm installed
- AWS account
- Amplify CLI installed (`npm install -g @aws-amplify/cli`)

### Step 1: Initialize Amplify

1. Initialize Amplify in your project:
   ```bash
   amplify init
   ```
   - Follow the prompts to set up your project
   - Choose a name for your environment (e.g., dev, prod)
   - Select your AWS profile or create a new one

### Step 2: Add Authentication

1. Add authentication to your project:
   ```bash
   amplify add auth
   ```
   - Choose the default configuration or customize as needed
   - You can enable email/phone verification, MFA, etc.

### Step 3: Add API (GraphQL)

1. Add a GraphQL API:
   ```bash
   amplify add api
   ```
   - Select GraphQL
   - Choose Amazon Cognito User Pool for authorization
   - When asked for the schema, use the schema from `amplify/schema.graphql`

### Step 4: Add Storage (S3)

1. Add storage for images and files:
   ```bash
   amplify add storage
   ```
   - Select Content (Images, audio, video, etc.)
   - Provide a name for your S3 bucket
   - Configure access permissions (Auth/Guest)

### Step 5: Deploy Your Backend

1. Deploy your Amplify backend:
   ```bash
   amplify push
   ```
   - This will create all the necessary AWS resources
   - It will also generate the necessary code for your API

### Step 6: Update Configuration

1. After deployment, Amplify will generate configuration information
2. Update the `lib/amplify-config.ts` file with the values from your Amplify project
3. You can find these values in the AWS Amplify Console or in the `aws-exports.js` file that Amplify generates

### Step 7: Seed Mock Data

1. Install ts-node if you haven't already:
   ```bash
   npm install --save-dev ts-node
   ```

2. Run the seeding script:
   ```bash
   npm run seed-data
   ```
   - This will populate your database with the mock data from the `mocks` directory
   - The script will create farms, categories, products, posts, and comments

### Troubleshooting

- **API Throttling**: If you encounter API throttling errors, the script includes delays between operations. You may need to increase these delays.
- **Authentication Errors**: Make sure you're signed in with Amplify Auth before running the seeding script.
- **Schema Mismatches**: If you encounter schema validation errors, check that the mock data structure matches your GraphQL schema.

### Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [GraphQL API with AWS AppSync](https://docs.amplify.aws/lib/graphqlapi/getting-started/q/platform/js/)
- [Authentication with Amplify](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/)

# Farm Fresh Delivery - Theme System

## Overview

This document outlines the standardized theme system implemented for the Farm Fresh Delivery app. The theme system provides a centralized way to manage visual consistency across the app.

## Core Components

### Theme Store

Located in `store/useThemeStore.ts`, the theme store is the single source of truth for theme values. It uses Zustand for state management and implements persistence via AsyncStorage.

Key features:
- Theme switching between light and dark modes
- Seasonal themes (Spring, Summer, Fall, Winter)
- Theme persistence across app restarts
- Type safety with TypeScript interfaces
- Error handling with fallbacks

### Theme Hook

Located in `hooks/useTheme.ts`, this is the recommended way to access theme values in components:

```tsx
import { useTheme } from '@/hooks/useTheme';

const MyComponent = () => {
  const { 
    colors, 
    theme, 
    season,
    toggleTheme,
    setSeason,
    toggleSeasonalTheme,
    isUsingSeasonalTheme 
  } = useTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Hello world!</Text>
      <Button onPress={toggleTheme}>Toggle Theme</Button>
      
      {/* Use seasonal colors */}
      <View style={{ backgroundColor: colors.seasonal }}>
        <Text>Current season: {season}</Text>
      </View>
    </View>
  );
};
```

### Theme Constants

Located in `constants/theme.ts` and `constants/colors.ts`, these define the available theme values:

- Color palette
- Seasonal colors
- Spacing scales
- Font sizes and weights
- Border radii
- Shadow styles

## Usage Guidelines

1. **Always use the theme hook**: Instead of directly importing the theme store, use the `useTheme` hook which provides error handling and fallbacks.

2. **Apply themed styles conditionally**: Use the theme values to conditionally style components.

3. **Use semantic color names**: Use semantic color names like `colors.primary` instead of specific colors like `'#4CAF50'`.

4. **Support both themes**: Ensure components look good in both light and dark modes.

5. **Use seasonal accents**: For seasonal UI elements, use `colors.seasonal` which will automatically update based on the current season.

## Implemented Components

The theme system has been implemented in:

1. Core UI components:
   - Button
   - Card
   - Badge
   - LoadingState
   - ErrorState
   - ThemeControls
   - ThemeToggle

2. Main screens:
   - HomeScreen
   - ProfileScreen
   - CartScreen
   - SubscriptionDetailScreen
   - FarmDetailScreen

3. Navigation components:
   - RootLayout
   - TabsLayout

4. Farm-related components:
   - FarmCard
   - FarmPostCard

## Seasonal Themes

The app now supports seasonal themes with colors that change based on:

1. **Spring**: Fresh greens representing growth and renewal
2. **Summer**: Warm ambers representing sunshine and harvest
3. **Fall**: Browns representing autumn leaves
4. **Winter**: Cool blues representing cold and clarity

The seasonal theme system can be toggled on/off in the user profile, and automatically detects the current season based on the device date.

## Seasonal Theming System

The app includes a dynamic seasonal theming system that:

1. **Changes accent colors based on the current season** (Spring, Summer, Fall, Winter)
2. **Persists theme preferences** using AsyncStorage
3. **Allows manual season selection** in the ThemeControls component

### HomeScreen Seasonal Features

The HomeScreen now includes seasonal features:

1. **Seasonal Header** - Displays the current season with a themed banner at the top
2. **Seasonal Product Section** - Shows products that are in season for the current season
3. **Themed Magic Basket Banner** - The border beams and button change color based on season

### Using Seasonal Theming

To toggle seasonal theming:

1. Navigate to the Profile screen
2. Use the ThemeControls component to:
   - Toggle light/dark mode
   - Toggle seasonal theme on/off
   - Manually select a season

When seasonal theming is on:
- Seasonal accent colors appear throughout the app
- Product badges show which items are in season
- Special seasonal banners appear at the top of screens

### Implementing Seasonal Support

Add seasonal data to your products with the `seasons` property:

```typescript
const product = {
  // Standard properties
  id: "123",
  name: "Organic Strawberries",
  // ...
  
  // Add seasonal information
  seasons: ['spring', 'summer']
};
```

Available seasons: `'spring'`, `'summer'`, `'fall'`, `'winter'`, `'year-round'`

## Future Enhancements

1. **Theme Editor**: Allow users to customize theme colors.

2. **Automatic Theme Switching**: Switch themes based on time of day or system settings.

3. **Accessibility Modes**: Implement high-contrast or large-text themes for better accessibility.