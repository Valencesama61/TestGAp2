/**
 * Expo Module Mock
 *
 * Provides minimal mocks for Expo modules used in the codebase.
 * This prevents imports from failing during tests.
 */

module.exports = {
  // Asset management
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(),
    })),
    loadAsync: jest.fn(),
  },

  // Constants
  Constants: {
    expoConfig: {
      name: 'TrellTech',
      version: '1.0.0',
    },
    manifest: {},
    platform: {
      ios: undefined,
      android: undefined,
    },
  },

  // Keep app awake
  KeepAwake: {
    activate: jest.fn(),
    deactivate: jest.fn(),
  },

  // Permissions
  Permissions: {
    askAsync: jest.fn(),
    getAsync: jest.fn(),
  },

  // Other commonly used Expo modules can be added here as needed
};
