import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import HashRouter from '../components/HashRouter';

export default function RootLayout() {
 useEffect(() => {
   if (Platform.OS === 'web') {
     // Handle initial hash routing
     const hash = window.location.hash;
     if (hash && hash.length > 1) {
       const route = hash.substring(1);
       import('expo-router').then(({ router }) => {
         setTimeout(() => router.replace(route as any), 100);
       });
     }
   }
 }, []);

 return (
   <>
     <HashRouter />
     <Stack screenOptions={{ headerShown: false }} />
   </>
 );
}
