import { useMutation, useQueryClient } from '@tanstack/react-query';
import checklistService from '../services/checklistService';

/**
 * Hook pour créer une nouvelle checklist
 * @returns {Object} Mutation result
 */
export const useCreateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistData) =>
      checklistService.createChecklist(checklistData),
    onSuccess: (data, variables) => {
      // Invalide le cache des checklists de la carte
      queryClient.invalidateQueries({
        queryKey: ['card', variables.idCard, 'checklists'],
      });
      queryClient.invalidateQueries({ queryKey: ['card', variables.idCard] });
    },
    onError: (error) => {
      console.error('Erreur lors de la création de la checklist:', error);
    },
  });
};

/**
 * Hook pour mettre à jour une checklist
 * @returns {Object} Mutation result
 */
export const useUpdateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, updates }) =>
      checklistService.updateChecklist(checklistId, updates),
    onSuccess: (data, variables) => {
      // Invalide le cache de la checklist
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId],
      });
      queryClient.invalidateQueries({ queryKey: ['card'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la checklist:', error);
    },
  });
};

/**
 * Hook pour supprimer une checklist
 * @returns {Object} Mutation result
 */
export const useDeleteChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistId) => checklistService.deleteChecklist(checklistId),
    onSuccess: (data, checklistId) => {
      // Invalide le cache des checklists
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] });
      queryClient.invalidateQueries({ queryKey: ['card'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression de la checklist:', error);
    },
  });
};

/**
 * Hook pour ajouter un item à une checklist
 * @returns {Object} Mutation result
 */
export const useAddChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, itemData }) =>
      checklistService.addChecklistItem(checklistId, itemData),
    onSuccess: (data, variables) => {
      // Invalide le cache de la checklist
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId],
      });
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId, 'items'],
      });
      queryClient.invalidateQueries({ queryKey: ['card'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout de l'item à la checklist:", error);
    },
  });
};

/**
 * Hook pour mettre à jour un item d'une checklist
 * @returns {Object} Mutation result
 */
export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, itemId, updates }) =>
      checklistService.updateChecklistItem(checklistId, itemId, updates),
    onSuccess: (data, variables) => {
      // Invalide le cache de la checklist
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId],
      });
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId, 'items'],
      });
      queryClient.invalidateQueries({ queryKey: ['card'] });
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la mise à jour de l'item de la checklist:",
        error
      );
    },
  });
};

/**
 * Hook pour supprimer un item d'une checklist
 * @returns {Object} Mutation result
 */
export const useDeleteChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ checklistId, itemId }) =>
      checklistService.deleteChecklistItem(checklistId, itemId),
    onSuccess: (data, variables) => {
      // Invalide le cache de la checklist
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId],
      });
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId, 'items'],
      });
      queryClient.invalidateQueries({ queryKey: ['card'] });
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la suppression de l'item de la checklist:",
        error
      );
    },
  });
};
