import { useMutation, useQueryClient } from '@tanstack/react-query';
import labelService from '../services/labelService';

/**
 * Hook pour créer un nouveau label
 * @returns {Object} Mutation result
 */
export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelData) => labelService.createLabel(labelData),
    onSuccess: (data, variables) => {
      // Invalide le cache des labels du board
      queryClient.invalidateQueries({
        queryKey: ['board', variables.idBoard, 'labels'],
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création du label:', error);
    },
  });
};

/**
 * Hook pour mettre à jour un label
 * @returns {Object} Mutation result
 */
export const useUpdateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ labelId, updates }) =>
      labelService.updateLabel(labelId, updates),
    onSuccess: (data, variables) => {
      // Invalide le cache du label et des labels du board
      queryClient.invalidateQueries({ queryKey: ['label', variables.labelId] });
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du label:', error);
    },
  });
};

/**
 * Hook pour supprimer un label
 * @returns {Object} Mutation result
 */
export const useDeleteLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labelId) => labelService.deleteLabel(labelId),
    onSuccess: (data, labelId) => {
      // Invalide le cache des labels
      queryClient.invalidateQueries({ queryKey: ['label', labelId] });
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du label:', error);
    },
  });
};

/**
 * Hook pour ajouter un label à une carte
 * @returns {Object} Mutation result
 */
export const useAddLabelToCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, labelId }) =>
      labelService.addLabelToCard(cardId, labelId),
    onSuccess: (data, variables) => {
      // Invalide le cache de la carte
      queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout du label à la carte:', error);
    },
  });
};

/**
 * Hook pour retirer un label d'une carte
 * @returns {Object} Mutation result
 */
export const useRemoveLabelFromCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, labelId }) =>
      labelService.removeLabelFromCard(cardId, labelId),
    onSuccess: (data, variables) => {
      // Invalide le cache de la carte
      queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
    onError: (error) => {
      console.error('Erreur lors du retrait du label de la carte:', error);
    },
  });
};
