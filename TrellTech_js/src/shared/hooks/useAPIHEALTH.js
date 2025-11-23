import { useState } from 'react';
import trelloClient from '../../api/trello/client';
import { useAuthStore } from '../../store/authStore';

/**
 * Hook pour tester la santé de l'API et la configuration
 */
export const useAPIHealth = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const { token } = useAuthStore();

  const testConfiguration = async () => {
    setIsTesting(true);
    try {
      console.log('Testing API configuration...');
      
      // Test 1: Configuration de base
      console.log('1. Axios config:', {
        baseURL: trelloClient.defaults.baseURL,
        timeout: trelloClient.defaults.timeout,
        hasAPIKey: !!trelloClient.defaults.params?.key
      });

      // Test 2: Appel API simple (sans auth)
      console.log('2. Testing public endpoint...');
      const publicResponse = await trelloClient.get('/actions/592f11060f95a3d3d46a987a');
      console.log(' Public API call successful');

      // Test 3: Appel avec auth si token disponible
      if (token) {
        console.log('3. Testing authenticated endpoint...');
        const authResponse = await trelloClient.get('/members/me');
        console.log('Authenticated API call successful');
        
        setTestResult({
          success: true,
          publicAPI: 'Working',
          authenticatedAPI: 'Working',
          user: authResponse.data
        });
      } else {
        setTestResult({
          success: true,
          publicAPI: ' Working',
          authenticatedAPI: 'No token',
          user: null
        });
      }

    } catch (error) {
      console.error(' API Test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        status: error.status
      });
    } finally {
      setIsTesting(false);
    }
  };

  return {
    isTesting,
    testResult,
    testConfiguration
  };
};