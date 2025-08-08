import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
 useEffect(() => {
   if (Platform.OS === 'web') {
     // Handle GitHub Pages hash routing
     const hash = window.location.hash;
     if (hash && hash.length > 1) {
       const route = hash.substring(1);
       import('expo-router').then(({ router }) => {
         router.replace(route as any);
       });
     }
   }
 }, []);

 return <Stack screenOptions={{ headerShown: false }} />;
}
