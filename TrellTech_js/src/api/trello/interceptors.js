import trelloClient from './client';
import { getAuthToken, clearAuthToken } from '../../store/authStore';

/**
 * Interceptors config
 */
export const setupInterceptors = () => {
  // interceptors query
  trelloClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      
      if (token) {
        config.params = {
          ...config.params,
          token: token,
        };
      }

      // Logger in development
      if (__DEV__) {
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
        });
      }

      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // interceptors responses
  trelloClient.interceptors.response.use(
    (response) => {
      if (__DEV__) {
        console.log('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
      return response;
    },
    (error) => {
      return handleAPIError(error);
    }
  );
};

/**
 * error handler
 */
const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Unauthorized - Invalid or expired token');
        clearAuthToken();
        // import { NavigationService } from '../../navigation/services';
        // NavigationService.navigate('Login');
        break;
      case 403:
        console.error('Access prohibited');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 429:
        console.error('Rate limit exceeded');
        break;
      default:
        console.error('API Error:', data?.message || 'Unknown error');
    }

    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      data,
    });
  } else if (error.request) {
    console.error('Network error - No response from server');
    return Promise.reject({
      status: 0,
      message: 'Connection problem. Check your internet connection.',
    });
  } else {
    console.error('Error:', error.message);
    return Promise.reject({
      status: -1,
      message: error.message,
    });
  }
};

export default trelloClient;