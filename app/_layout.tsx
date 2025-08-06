import '../utils/alertPolyfill';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { EstudayProvider } from '@/contexts/StudayContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <EstudayProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </EstudayProvider>
  );
}