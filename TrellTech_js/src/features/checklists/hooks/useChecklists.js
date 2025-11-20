import { useQuery } from '@tanstack/react-query';
import checklistService from '../services/checklistService';

/**
 * Hook pour récupérer une checklist par son ID
 * @param {string} checklistId - ID de la checklist
 * @returns {Object} Query result avec les données de la checklist
 */
export const useChecklist = (checklistId) => {
  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: () => checklistService.getChecklistById(checklistId),
    enabled: !!checklistId,
    staleTime: 30000, // 30 secondes
  });
};

/**
 * Hook pour récupérer toutes les checklists d'une carte
 * @param {string} cardId - ID de la carte
 * @returns {Object} Query result avec la liste des checklists
 */
export const useCardChecklists = (cardId) => {
  return useQuery({
    queryKey: ['card', cardId, 'checklists'],
    queryFn: () => checklistService.getCardChecklists(cardId),
    enabled: !!cardId,
    staleTime: 30000,
  });
};

/**
 * Hook pour récupérer les items d'une checklist
 * @param {string} checklistId - ID de la checklist
 * @returns {Object} Query result avec la liste des items
 */
export const useChecklistItems = (checklistId) => {
  return useQuery({
    queryKey: ['checklist', checklistId, 'items'],
    queryFn: () => checklistService.getChecklistItems(checklistId),
    enabled: !!checklistId,
    staleTime: 30000,
  });
};
