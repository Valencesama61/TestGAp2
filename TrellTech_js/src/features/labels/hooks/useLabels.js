import { useQuery } from '@tanstack/react-query';
import labelService from '../services/labelService';

/**
 * Hook pour récupérer un label par son ID
 * @param {string} labelId - ID du label
 * @returns {Object} Query result avec les données du label
 */
export const useLabel = (labelId) => {
  return useQuery({
    queryKey: ['label', labelId],
    queryFn: () => labelService.getLabelById(labelId),
    enabled: !!labelId,
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook pour récupérer tous les labels d'un board
 * @param {string} boardId - ID du board
 * @returns {Object} Query result avec la liste des labels
 */
export const useBoardLabels = (boardId) => {
  return useQuery({
    queryKey: ['board', boardId, 'labels'],
    queryFn: () => labelService.getBoardLabels(boardId),
    enabled: !!boardId,
    staleTime: 30000, // 30 secondes
  });
};
