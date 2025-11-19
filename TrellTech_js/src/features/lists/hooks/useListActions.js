import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList, updateList, archiveList, moveAllCards } from '../services/listService';

/**
 * Hook pour les actions CRUD sur les listes
 */
export const useListActions = () => {
  const queryClient = useQueryClient();

  const createListMutation = useMutation({
    mutationFn: createList,
    onSuccess: (data, variables) => {
      // Invalider les listes du board
      queryClient.invalidateQueries({ queryKey: ['boards', variables.idBoard, 'lists'] });
    },
  });

  const updateListMutation = useMutation({
    mutationFn: ({ id, updates }) => updateList(id, updates),
    onSuccess: (data, variables) => {
      // Invalider la liste spécifique
      queryClient.invalidateQueries({ queryKey: ['lists', variables.id] });
      // Invalider aussi les listes du board parent si disponible
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const archiveListMutation = useMutation({
    mutationFn: archiveList,
    onSuccess: () => {
      // Invalider toutes les listes
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const moveAllCardsMutation = useMutation({
    mutationFn: ({ id, idBoard, idList }) => moveAllCards(id, idBoard, idList),
    onSuccess: () => {
      // Invalider les cartes des listes concernées
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  return {
    createList: createListMutation.mutateAsync,
    updateList: updateListMutation.mutateAsync,
    archiveList: archiveListMutation.mutateAsync,
    moveAllCards: moveAllCardsMutation.mutateAsync,
    isCreating: createListMutation.isPending,
    isUpdating: updateListMutation.isPending,
    isArchiving: archiveListMutation.isPending,
    isMoving: moveAllCardsMutation.isPending,
  };
};
