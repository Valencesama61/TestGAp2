module.exports = {
  preset: "jest-expo",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup/jest.setup.js"],

  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native"
      + "|@react-native"
      + "|react-native"
      + "|expo(nent)?"
      + "|@expo(nent)?"
      + "|@expo-google-fonts"
      + "|msw"
      + "|until-async"
      + ")"
  ],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/src/__tests__/setup/fileMock.js",
  },

  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
};
