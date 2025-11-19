import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCard,
  updateCard,
  deleteCard,
  addMemberToCard,
  removeMemberFromCard,
  addLabelToCard,
  removeLabelFromCard,
  addCommentToCard,
} from '../services/cardService';

/**
 * Hook pour les actions CRUD sur les cartes
 */
export const useCardActions = () => {
  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (data, variables) => {
      // Invalider les cartes de la liste
      queryClient.invalidateQueries({ queryKey: ['lists', variables.idList, 'cards'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, updates }) => updateCard(id, updates),
    onSuccess: (data, variables) => {
      // Invalider la carte spécifique et les listes
      queryClient.invalidateQueries({ queryKey: ['cards', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      // Invalider toutes les cartes
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ cardId, memberId }) => addMemberToCard(cardId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ cardId, memberId }) => removeMemberFromCard(cardId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId] });
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: ({ cardId, labelId }) => addLabelToCard(cardId, labelId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId] });
    },
  });

  const removeLabelMutation = useMutation({
    mutationFn: ({ cardId, labelId }) => removeLabelFromCard(cardId, labelId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ cardId, text }) => addCommentToCard(cardId, text),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.cardId, 'comments'] });
    },
  });

  return {
    createCard: createCardMutation.mutateAsync,
    updateCard: updateCardMutation.mutateAsync,
    deleteCard: deleteCardMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    addLabel: addLabelMutation.mutateAsync,
    removeLabel: removeLabelMutation.mutateAsync,
    addComment: addCommentMutation.mutateAsync,
    isCreating: createCardMutation.isPending,
    isUpdating: updateCardMutation.isPending,
    isDeleting: deleteCardMutation.isPending,
  };
};
