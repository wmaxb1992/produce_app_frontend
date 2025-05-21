# Farm Fresh Delivery Style Guide

## Directory Structure

```
styles/
├── components/           # Component-specific styles
│   ├── product.ts       # Product-related component styles
│   ├── farm.ts         # Farm-related component styles
│   └── ui.ts           # Common UI component styles
├── layouts/             # Screen-specific layouts
│   └── home.ts         # Home screen layout
├── themes/              # Theme configurations
│   └── index.ts        # Theme definitions
├── animations/          # Animation configurations
│   └── index.ts        # Reusable animations
└── constants/          # Style constants
    └── spacing.ts      # Spacing and margin values
```

## Adding New Components

1. **Create Component Style File**:
   ```typescript
   // styles/components/your-component.ts
   import { StyleSheet } from 'react-native';
   import defaultColors from '@/constants/colors';
   import { padding, margin } from '../constants/spacing';
   import { borderRadius } from '@/constants/theme';

   export const yourComponentStyles = StyleSheet.create({
     container: {
       // Your styles here
     },
     // Add more style objects
   });
   ```

2. **Use in Component**:
   ```typescript
   // components/YourComponent.tsx
   import { yourComponentStyles } from '@/styles/components/your-component';

   export const YourComponent = () => {
     return (
       <View style={yourComponentStyles.container}>
         {/* Component content */}
       </View>
     );
   };
   ```

## Adding Animations

1. **Create Animation**:
   ```typescript
   // styles/animations/index.ts
   import { Animated, Easing } from 'react-native';

   export const yourAnimation = (
     animValue: Animated.Value,
     config = { duration: 300 }
   ) => {
     return Animated.timing(animValue, {
       toValue: 1,
       duration: config.duration,
       easing: Easing.ease,
       useNativeDriver: true,
     });
   };
   ```

2. **Use in Component**:
   ```typescript
   import { yourAnimation } from '@/styles/animations';

   const YourComponent = () => {
     const animValue = useRef(new Animated.Value(0)).current;

     useEffect(() => {
       yourAnimation(animValue).start();
     }, []);

     return (
       <Animated.View
         style={[
           styles.container,
           {
             opacity: animValue,
           },
         ]}
       >
         {/* Content */}
       </Animated.View>
     );
   };
   ```

## Style Guidelines

### 1. Colors
- Use theme colors from `defaultColors`
- Never hardcode color values
- Access via `defaultColors.light` or `defaultColors.dark`

### 2. Spacing
- Use predefined spacing values from `spacing.ts`
- Available values: xs, sm, md, lg, xl
- Access via `padding.sm` or `margin.md`

### 3. Border Radius
- Use predefined border radius values
- Access via `borderRadius.sm`, `borderRadius.md`, etc.

### 4. Typography
- Font sizes should be consistent
- Use predefined text styles from `ui.ts`
- Common text styles: title, subtitle, body, caption

### 5. Layout
- Use flexbox for layouts
- Keep layouts responsive
- Screen-specific layouts go in `layouts/`

## Best Practices

1. **Component Organization**:
   - Group related components in feature folders
   - Keep components small and focused
   - Extract reusable styles to `ui.ts`

2. **Style Naming**:
   - Use descriptive names
   - Follow camelCase convention
   - Group related styles together

3. **Theme Support**:
   - Always use theme colors
   - Test components in both light/dark modes
   - Use semantic color names (e.g., `primary`, `secondary`)

4. **Animations**:
   - Keep animations smooth and subtle
   - Use `useNativeDriver` when possible
   - Reuse animation configurations

5. **Maintenance**:
   - Document complex styles
   - Remove unused styles
   - Keep style files focused and organized

## Example Usage

```typescript
// New Feature Component
import { StyleSheet } from 'react-native';
import { uiStyles } from '@/styles/components/ui';
import { padding, margin } from '@/styles/constants/spacing';

const featureStyles = StyleSheet.create({
  container: {
    ...uiStyles.container,
    marginBottom: margin.md,
  },
  header: {
    ...uiStyles.sectionHeader,
    paddingHorizontal: padding.sm,
  },
});

// Use in component
const FeatureComponent = () => {
  return (
    <View style={featureStyles.container}>
      <View style={featureStyles.header}>
        {/* Content */}
      </View>
    </View>
  );
};
```

## Questions & Support

For questions about styling or component organization, please:
1. Check existing components for similar patterns
2. Review the style constants for available values
3. Consult the theme configuration for color options
