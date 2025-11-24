module.exports = {
  // Don't use jest-expo preset - it loads Expo modules we don't need for service tests
  // preset: "jest-expo",

  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup/jest.setup.js"],

  // Transform these modules from ESM to CommonJS
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|msw|axios)",
  ],

  // Module name mappings - CRITICAL for fixing Expo Winter issue
  moduleNameMapper: {
    // Static assets
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/src/__tests__/setup/fileMock.js",

    // Mock React Native modules
    "^react-native$": "<rootDir>/src/__tests__/setup/reactNativeMock.js",

    // CRITICAL: Mock Expo's Winter runtime to prevent import errors
    "^expo/src/winter/.*$": "<rootDir>/src/__tests__/setup/expoWinterMock.js",
    "^expo$": "<rootDir>/src/__tests__/setup/expoMock.js",
  },

  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],

  // Test file patterns - only files ending in .test.js
  testMatch: [
    "**/__tests__/integration/**/*.test.js",
  ],

  // Ignore patterns for test discovery
  testPathIgnorePatterns: [
    "/node_modules/",
    "/android/",
    "/ios/",
    "/src/__tests__/mocks/",
    "/src/__tests__/setup/",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.test.{js,jsx,ts,tsx}",
    "!src/__tests__/**",
  ],
};
