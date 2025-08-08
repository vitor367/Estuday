import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // GitHub Pages SPA routing fix para web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleGitHubPagesRouting = () => {
        const { search, pathname, hash } = window.location;
        
        // Verificar se há parâmetros de redirecionamento do GitHub Pages
        const params = new URLSearchParams(search);
        const redirect = params.get('p');
        
        if (redirect) {
          // Limpar URL e navegar
          const newPath = `${pathname}#${redirect}`;
          window.history.replaceState(null, '', newPath);
        }
        
        // Lidar com hash routing
        if (hash && hash.length > 1) {
          const route = hash.substring(1);
          if (route.startsWith('/')) {
            // Usar router do Expo para navegar
            import('expo-router').then(({ router }) => {
              setTimeout(() => {
                router.replace(route as any);
              }, 0);
            });
          }
        }
      };

      handleGitHubPagesRouting();
    }
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
