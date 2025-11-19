import { useQuery } from '@tanstack/react-query';
import { getBoards, getBoardById, getBoardLists, getBoardCards } from '../services/boardService';

/**
 * Hook pour récupérer tous les boards
 */
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });
};

/**
 * Hook pour récupérer un board spécifique
 */
export const useBoard = (id) => {
  return useQuery({
    queryKey: ['boards', id],
    queryFn: () => getBoardById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour récupérer les listes d'un board
 */
export const useBoardLists = (boardId) => {
  return useQuery({
    queryKey: ['boards', boardId, 'lists'],
    queryFn: () => getBoardLists(boardId),
    enabled: !!boardId,
  });
};

/**
 * Hook pour récupérer les cartes d'un board
 */
export const useBoardCards = (boardId) => {
  return useQuery({
    queryKey: ['boards', boardId, 'cards'],
    queryFn: () => getBoardCards(boardId),
    enabled: !!boardId,
  });
};
