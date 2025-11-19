import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import listService from '../services/listService';

/**
 * Hook pour récupérer une liste spécifique
 */
export const useList = (listId) => {
  return useQuery({
    queryKey: ['list', listId],
    queryFn: () => listService.getListById(listId),
    enabled: !!listId,
  });
};

/**
 * Hook pour récupérer les cartes d'une liste
 */
export const useListCards = (listId) => {
  return useQuery({
    queryKey: ['list-cards', listId],
    queryFn: () => listService.getListCards(listId),
    enabled: !!listId,
  });
};

/**
 * Hook pour créer une liste
 */
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, name }) => listService.createList(boardId, name),
    onSuccess: (newList) => {
      queryClient.invalidateQueries(['board-lists', newList.idBoard]);
    },
  });
};

/**
 * Hook pour mettre à jour une liste
 */
export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, name }) => listService.updateList(listId, name),
    onSuccess: (updatedList) => {
      queryClient.invalidateQueries(['list', updatedList.id]);
      queryClient.invalidateQueries(['board-lists', updatedList.idBoard]);
    },
  });
};

/**
 * Hook pour archiver une liste
 */
export const useArchiveList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, boardId }) => listService.archiveList(listId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
    },
  });
};
