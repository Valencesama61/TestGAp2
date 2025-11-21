import { useMutation, useQueryClient } from '@tanstack/react-query';
import boardService from '../services/boardService';

/**
 * Hook pour créer un board
 */
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, desc }) => boardService.createBoard(name, desc),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.error('Board creation error:', error);
    },
  });
};

/**
 * Hook pour mettre à jour un board
 */
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, updates }) => boardService.updateBoard(boardId, updates),
    onSuccess: (updatedBoard) => {
      queryClient.invalidateQueries(['board', updatedBoard.id]);
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.error('Board update error:', error);
    },
  });
};

/**
 * Hook pour supprimer un board
 */
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId) => boardService.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.error('Board deletion error:', error);
    },
  });
};

/**
 * Hook pour archiver un board
 */
export const useArchiveBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boardId) => boardService.archiveBoard(boardId),
    onSuccess: (archivedBoard) => {
      queryClient.invalidateQueries(['board', archivedBoard.id]);
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.error('Board archiving error:', error);
    },
  });
};
