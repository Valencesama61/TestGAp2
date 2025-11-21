// hooks/useListActions.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import listService from '../services/listService';

/**
 * Hook pour créer une liste
 */
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, name }) => listService.createList(boardId, name),
    onSuccess: (data, variables) => {
      // Invalider et refetch les listes du board
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
    },
    onError: (error) => {
      console.error('Error creating list:', error);
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
    onSuccess: (data) => {
      // Invalider la liste spécifique et les listes du board
      queryClient.invalidateQueries(['list', data.id]);
      queryClient.invalidateQueries(['board-lists', data.idBoard]);
    },
    onError: (error) => {
      console.error('Error updating list:', error);
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
    onSuccess: (data, variables) => {
      // Invalider les listes du board
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
    },
    onError: (error) => {
      console.error('Error archiving list:', error);
    },
  });
};

/**
 * Hook pour supprimer une liste (via archivage)
 */
export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, boardId }) => listService.archiveList(listId),
    onSuccess: (data, variables) => {
      // Invalider les listes du board
      queryClient.invalidateQueries(['board-lists', variables.boardId]);
    },
    onError: (error) => {
      console.error('Error deleting list:', error);
    },
  });
};