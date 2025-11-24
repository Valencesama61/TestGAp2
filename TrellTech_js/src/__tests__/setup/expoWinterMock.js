/**
 * Expo Winter Runtime Mock
 *
 * This mock prevents Expo's Winter runtime from trying to import
 * files outside the test scope, which causes the import error.
 *
 * Expo SDK 54+ uses "Winter" which is not compatible with Node test environment.
 */

module.exports = {};
