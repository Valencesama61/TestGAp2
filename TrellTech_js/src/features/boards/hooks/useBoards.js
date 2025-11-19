import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import boardService from '../services/boardService';

/**
 * Hook pour récupérer tous les boards
 */
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => boardService.getBoards(),
    staleTime: 60000,
  });
};

/**
 * Hook pour récupérer un board spécifique
 */
export const useBoard = (boardId) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => boardService.getBoardById(boardId),
    enabled: !!boardId,
  });
};

/**
 * Hook pour récupérer les listes d'un board
 */
export const useBoardLists = (boardId) => {
  return useQuery({
    queryKey: ['board-lists', boardId],
    queryFn: () => boardService.getBoardLists(boardId),
    enabled: !!boardId,
  });
};

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
  });
};
