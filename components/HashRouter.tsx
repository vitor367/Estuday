import { useEffect } from 'react';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export default function HashRouter() {
 useEffect(() => {
   if (Platform.OS === 'web') {
     // Interceptar todas as mudanças de URL
     const originalPushState = history.pushState;
     const originalReplaceState = history.replaceState;
     
     history.pushState = function(state, title, url) {
       if (typeof url === 'string' && !url.startsWith('#')) {
         url = '#' + url;
       }
       return originalPushState.call(this, state, title, url);
     };
     
     history.replaceState = function(state, title, url) {
       if (typeof url === 'string' && !url.startsWith('#')) {
         url = '#' + url;
       }
       return originalReplaceState.call(this, state, title, url);
     };
   }
 }, []);

 return null;
}
