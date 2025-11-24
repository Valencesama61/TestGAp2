/**
 * React Native Mock for Jest Tests
 *
 * This mock provides minimal implementations of React Native modules
 * that aren't needed for integration tests (which focus on services/API calls)
 * but are imported by the codebase.
 */

module.exports = {
  // Platform detection
  Platform: {
    OS: 'ios',
    Version: 123,
    select: (obj) => obj.ios || obj.default,
  },

  // StyleSheet mock
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
  },

  // View mock
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  Image: 'Image',
  ActivityIndicator: 'ActivityIndicator',

  // Alert mock
  Alert: {
    alert: jest.fn(),
  },

  // Dimensions mock
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // Animated mock
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn(() => ({})),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
  },

  // Other commonly used modules
  SafeAreaView: 'SafeAreaView',
  FlatList: 'FlatList',
  SectionList: 'SectionList',
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  Modal: 'Modal',
  Pressable: 'Pressable',
};
