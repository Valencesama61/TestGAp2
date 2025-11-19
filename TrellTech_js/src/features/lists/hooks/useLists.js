import { useQuery } from '@tanstack/react-query';
import { getListById, getListCards } from '../services/listService';

/**
 * Hook pour récupérer une liste spécifique
 */
export const useList = (id) => {
  return useQuery({
    queryKey: ['lists', id],
    queryFn: () => getListById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour récupérer les cartes d'une liste
 */
export const useListCards = (listId) => {
  return useQuery({
    queryKey: ['lists', listId, 'cards'],
    queryFn: () => getListCards(listId),
    enabled: !!listId,
  });
};
