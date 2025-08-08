import { useEffect } from 'react';

export default function SpaRedirect() {
  useEffect(() => {
    // Handle GitHub Pages SPA routing
    const handleSpaRouting = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect) {
        // Remove redirect param and navigate
        const url = new URL(window.location.href);
        url.searchParams.delete('redirect');
        window.history.replaceState({}, '', url.toString());
        
        // Navigate to the intended route
        if (typeof redirect === 'string' && redirect.startsWith('/')) {
          // Use your navigation method here
          console.log('Redirecting to:', redirect);
        }
      }
    };

    handleSpaRouting();
  }, []);

  return null;
}
