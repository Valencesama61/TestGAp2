import { useQuery } from '@tanstack/react-query';
import { getCardById, getCardMembers, getCardComments } from '../services/cardService';

/**
 * Hook pour récupérer une carte spécifique
 */
export const useCard = (id) => {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: () => getCardById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour récupérer les membres d'une carte
 */
export const useCardMembers = (cardId) => {
  return useQuery({
    queryKey: ['cards', cardId, 'members'],
    queryFn: () => getCardMembers(cardId),
    enabled: !!cardId,
  });
};

/**
 * Hook pour récupérer les commentaires d'une carte
 */
export const useCardComments = (cardId) => {
  return useQuery({
    queryKey: ['cards', cardId, 'comments'],
    queryFn: () => getCardComments(cardId),
    enabled: !!cardId,
  });
};
