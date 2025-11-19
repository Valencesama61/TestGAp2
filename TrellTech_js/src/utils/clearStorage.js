import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utilitaire pour nettoyer complètement le storage
 * À utiliser en cas de problème avec des données corrompues
 */
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ Storage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

/**
 * Nettoyer uniquement le storage d'authentification
 */
export const clearAuthStorage = async () => {
  try {
    await AsyncStorage.removeItem('trelltech-auth-storage');
    console.log('✅ Auth storage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing auth storage:', error);
    return false;
  }
};

/**
 * Afficher toutes les clés du storage (debug)
 */
export const debugStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('📦 Storage keys:', keys);

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`  ${key}:`, value);
    }

    return keys;
  } catch (error) {
    console.error('❌ Error debugging storage:', error);
    return [];
  }
};
