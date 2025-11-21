import { useQuery } from '@tanstack/react-query';
import profileService from '../services/profileService';

/**
 * Hook pour récupérer le profil de l'utilisateur connecté
 * @returns {Object} Query result avec les données du profil
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getMyProfile,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook pour récupérer un membre spécifique
 * @param {string} memberId - ID du membre
 * @returns {Object} Query result avec les données du membre
 */
export const useMember = (memberId) => {
  return useQuery({
    queryKey: ['member', memberId],
    queryFn: () => profileService.getMemberById(memberId),
    enabled: !!memberId,
    staleTime: 60000,
  });
};

/**
 * Hook pour récupérer les boards de l'utilisateur
 * @returns {Object} Query result avec la liste des boards
 */
export const useMyBoards = () => {
  return useQuery({
    queryKey: ['profile', 'boards'],
    queryFn: profileService.getMyBoards,
    staleTime: 30000, // 30 secondes
  });
};

/**
 * Hook pour récupérer les organisations de l'utilisateur
 * @returns {Object} Query result avec la liste des organisations
 */
export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ['profile', 'organizations'],
    queryFn: profileService.getMyOrganizations,
    staleTime: 60000,
  });
};

/**
 * Hook pour récupérer les cartes assignées à l'utilisateur
 * @returns {Object} Query result avec la liste des cartes
 */
export const useMyCards = () => {
  return useQuery({
    queryKey: ['profile', 'cards'],
    queryFn: profileService.getMyCards,
    staleTime: 30000,
  });
};

/**
 * Hook pour récupérer les notifications de l'utilisateur
 * @param {number} limit - Nombre de notifications à récupérer
 * @returns {Object} Query result avec la liste des notifications
 */
export const useMyNotifications = (limit = 20) => {
  return useQuery({
    queryKey: ['profile', 'notifications', limit],
    queryFn: () => profileService.getMyNotifications(limit),
    staleTime: 10000, // 10 secondes (notifications plus fréquentes)
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};
