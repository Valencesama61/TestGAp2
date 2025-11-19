import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBoard, updateBoard, deleteBoard } from '../services/boardService';

/**
 * Hook pour les actions CRUD sur les boards
 */
export const useBoardActions = () => {
  const queryClient = useQueryClient();

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      // Invalider et refetch la liste des boards
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, updates }) => updateBoard(id, updates),
    onSuccess: (data, variables) => {
      // Invalider et refetch le board spécifique et la liste
      queryClient.invalidateQueries({ queryKey: ['boards', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      // Invalider et refetch la liste des boards
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  return {
    createBoard: createBoardMutation.mutateAsync,
    updateBoard: updateBoardMutation.mutateAsync,
    deleteBoard: deleteBoardMutation.mutateAsync,
    isCreating: createBoardMutation.isPending,
    isUpdating: updateBoardMutation.isPending,
    isDeleting: deleteBoardMutation.isPending,
  };
};
