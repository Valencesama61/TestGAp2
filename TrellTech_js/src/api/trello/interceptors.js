// import trelloClient from './client';
// import { getAuthToken, clearAuthToken } from '../../store/authStore';

// /**
//  * Configuration des intercepteurs
//  */
// export const setupInterceptors = () => {
//   // Intercepteur de requêtes
//   trelloClient.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
      
//       if (token) {
//         config.params = {
//           ...config.params,
//           token: token,
//         };
//       }

//       // Logger en développement
//       if (__DEV__) {
//         console.log('API Request:', {
//           method: config.method?.toUpperCase(),
//           url: config.url,
//           params: config.params,
//         });
//       }

//       return config;
//     },
//     (error) => {
//       console.error('Request Error:', error);
//       return Promise.reject(error);
//     }
//   );

//   // Intercepteur de réponses
//   trelloClient.interceptors.response.use(
//     (response) => {
//       if (__DEV__) {
//         console.log('API Response:', {
//           status: response.status,
//           url: response.config.url,
//           data: response.data,
//         });
//       }
//       return response;
//     },
//     (error) => {
//       return handleAPIError(error);
//     }
//   );
// };

// /**
//  * Gestion centralisée des erreurs
//  */
// const handleAPIError = (error) => {
//   if (error.response) {
//     const { status, data } = error.response;

//     switch (status) {
//       case 401:
//         console.error('Unauthorized - Invalid or expired token');
//         clearAuthToken();
//         // Vous pourrez utiliser votre navigation ici
//         // import { NavigationService } from '../../navigation/services';
//         // NavigationService.navigate('Login');
//         break;
//       case 403:
//         console.error('Access prohibited');
//         break;
//       case 404:
//         console.error('Resource not found');
//         break;
//       case 429:
//         console.error('Rate limit exceeded');
//         break;
//       default:
//         console.error('API Error:', data?.message || 'Unknown error');
//     }

//     return Promise.reject({
//       status,
//       message: data?.message || 'An error occurred',
//       data,
//     });
//   } else if (error.request) {
//     console.error('Network error - No response from server');
//     return Promise.reject({
//       status: 0,
//       message: 'Connection problem. Check your internet connection.',
//     });
//   } else {
//     console.error('Error:', error.message);
//     return Promise.reject({
//       status: -1,
//       message: error.message,
//     });
//   }
// };

// export default trelloClient;


import trelloClient from './client';
import { getAuthToken, clearAuthToken } from '../../store/authStore';

/**
 * Configuration des intercepteurs
 */
export const setupInterceptors = () => {
  // Intercepteur de requêtes
  trelloClient.interceptors.request.use(
    (config) => {
      // const token = getAuthToken();
      const token = process.env.EXPO_PUBLIC_TRELLO_TOKEN;

      
      if (token) {
        config.params = {
          ...config.params,
          token: token,
        };
      }

      // Logger en développement
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

  // Intercepteur de réponses
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
 * Gestion centralisée des erreurs
 */
const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.error('Unauthorized - Invalid or expired token');
        clearAuthToken();
        // Utiliser la navigation ici
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