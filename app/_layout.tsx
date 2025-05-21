import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import useThemeStore from '@/store/useThemeStore';

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add any custom fonts here if needed
  });

  const colorScheme = useColorScheme();
  const themeStore = useThemeStore();
  const { colors, theme } = useTheme();
  
  // Initialize theme if not already set
  useEffect(() => {
    // If theme is not initialized, initialize it with the device color scheme
    if (!themeStore.theme) {
      const deviceTheme = colorScheme === 'dark' ? 'dark' : 'light';
      themeStore.setThemeType(deviceTheme);
    }
    
    // Log the theme for debugging
    console.log('Theme initialized:', themeStore.themeType);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="farms-map" options={{ headerShown: true, title: "Farms Near You" }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}