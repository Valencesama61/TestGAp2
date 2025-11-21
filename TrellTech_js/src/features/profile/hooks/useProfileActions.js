import { useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../services/profileService';

/**
 * Hook pour mettre à jour le profil
 * @returns {Object} Mutation result
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates) => profileService.updateProfile(updates),
    onSuccess: () => {
      // Invalide le cache du profil pour forcer un refresh
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du profil:', error);
    },
  });
};

/**
 * Hook pour mettre à jour l'avatar
 * @returns {Object} Mutation result
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatarSource, file }) =>
      profileService.updateAvatar(avatarSource, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
    },
  });
};

/**
 * Hook pour marquer une notification comme lue
 * @returns {Object} Mutation result
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId) =>
      profileService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'notifications'] });
    },
    onError: (error) => {
      console.error(
        'Erreur lors du marquage de la notification comme lue:',
        error
      );
    },
  });
};

/**
 * Hook pour marquer toutes les notifications comme lues
 * @returns {Object} Mutation result
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'notifications'] });
    },
    onError: (error) => {
      console.error(
        'Erreur lors du marquage de toutes les notifications comme lues:',
        error
      );
    },
  });
};
