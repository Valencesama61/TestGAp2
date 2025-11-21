import { useMutation, useQueryClient } from '@tanstack/react-query';
import listService from '../services/listService';

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
    onError: (error) => {
      console.error('List creation error:', error);
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
    onError: (error) => {
      console.error('List update error:', error);
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
      queryClient.invalidateQueries(['list', variables.listId]);
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
    },
    onError: (error) => {
      console.error('List archiving error:', error);
    },
  });
};

/**
 * Hook pour déplacer toutes les cartes d'une liste
 */
export const useMoveAllCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sourceListId, targetListId, boardId }) =>
      listService.moveAllCards(sourceListId, targetListId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
      queryClient.invalidateQueries(['cards', variables.sourceListId]);
      queryClient.invalidateQueries(['cards', variables.targetListId]);
    },
    onError: (error) => {
      console.error('Move all cards error:', error);
    },
  });
};
