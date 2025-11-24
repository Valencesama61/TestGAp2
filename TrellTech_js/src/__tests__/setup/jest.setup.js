/**
 * ===========================================
 * JEST SETUP CONFIGURATION
 * ===========================================
 *
 * This file configures the testing environment before tests run.
 *
 * SETUP INCLUDES:
 * - TextEncoder/TextDecoder polyfills for MSW
 * - Jest Native matchers for React Native assertions
 * - Fetch polyfill for API calls
 * - MSW server setup and lifecycle
 * - AsyncStorage mock
 * - WebBrowser mock
 */

// ============================================
// POLYFILLS FOR MSW
// ============================================

/**
 * TextEncoder/TextDecoder polyfills
 * Required by MSW to handle request/response bodies in Node environment
 */
import { TextEncoder, TextDecoder } from "util";

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

// ============================================
// TESTING LIBRARY EXTENSIONS
// ============================================

/**
 * Jest Native matchers
 * Provides additional assertions for React Native components
 * Examples: toBeVisible(), toHaveTextContent(), etc.
 */
import "@testing-library/jest-native/extend-expect";

/**
 * Fetch polyfill
 * Enables fetch API in Node environment for API calls
 */
import "whatwg-fetch";

// ============================================
// MOCK SERVICE WORKER (MSW) SETUP
// ============================================

/**
 * MSW Server
 * Intercepts HTTP requests during tests and returns mock responses
 * This allows us to test API integration without making real API calls
 */
import { server } from "../mocks/server";

/**
 * MSW Lifecycle hooks
 * - beforeAll: Start MSW server before all tests
 * - afterEach: Reset handlers after each test (clean slate)
 * - afterAll: Stop MSW server after all tests complete
 */
beforeAll(() => {
  // Start the MSW server
  server.listen({
    // Log warnings if requests are made that aren't handled by MSW
    onUnhandledRequest: 'warn'
  });
});

afterEach(() => {
  // Reset handlers to initial state after each test
  // This ensures test isolation
  server.resetHandlers();
});

afterAll(() => {
  // Stop the MSW server after all tests complete
  server.close();
});

// ============================================
// GLOBAL MOCKS
// ============================================

/**
 * Mock console methods to reduce noise in test output
 * Comment these out if you need to debug tests
 */
global.console = {
  ...console,
  // Suppress console logs during tests to reduce noise
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

/**
 * Mock environment variables
 * Set required environment variables for tests
 */
process.env.EXPO_PUBLIC_TRELLO_API_KEY = 'test_api_key_12345';
process.env.EXPO_PUBLIC_TRELLO_API_BASE_URL = 'https://api.trello.com/1';

/**
 * Define __DEV__ global variable
 * Used by React Native and Expo for development mode checks
 */
global.__DEV__ = false; // Set to false to reduce noise in tests

// ============================================
// EXPO MOCKS
// ============================================

/**
 * Mock expo-web-browser
 * Used for OAuth authentication flow
 */
jest.mock('expo-web-browser', () => ({
  openAuthSessionAsync: jest.fn(),
  dismissBrowser: jest.fn(),
  maybeCompleteAuthSession: jest.fn(),
}));

/**
 * Mock @react-native-async-storage/async-storage
 * Used for token persistence
 */
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

/**
 * Mock auth store to provide token for API requests
 * This allows tests to work with the axios interceptor
 */
jest.mock('../../store/authStore', () => ({
  getAuthToken: jest.fn(() => 'mock_test_token_12345'),
  clearAuthToken: jest.fn(),
  useAuthStore: jest.fn(),
  AuthProvider: ({ children }) => children,
}));
