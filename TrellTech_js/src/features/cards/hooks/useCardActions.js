import { useMutation, useQueryClient } from '@tanstack/react-query';
import cardService from '../services/cardService';

/**
 * Hook pour créer une carte
 */
export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardData) => cardService.createCard(cardData),
    onSuccess: (newCard) => {
      queryClient.invalidateQueries(['cards', newCard.idList]);
      queryClient.invalidateQueries(['board-lists', newCard.idBoard]);
    },
    onError: (error) => {
      console.error('Card creation error:', error);
    },
  });
};

/**
 * Hook pour mettre à jour une carte
 */
export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, updates }) => cardService.updateCard(cardId, updates),
    onSuccess: (updatedCard) => {
      queryClient.invalidateQueries(['card', updatedCard.id]);
      queryClient.invalidateQueries(['cards', updatedCard.idList]);
    },
    onError: (error) => {
      console.error('Card update error:', error);
    },
  });
};

/**
 * Hook pour supprimer une carte
 */
export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, listId }) => cardService.deleteCard(cardId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['cards', variables.listId]);
    },
    onError: (error) => {
      console.error('Card deletion error:', error);
    },
  });
};

/**
 * Hook pour déplacer une carte vers une autre liste
 */
export const useMoveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, newListId, oldListId }) =>
      cardService.moveCard(cardId, newListId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['cards', variables.oldListId]);
      queryClient.invalidateQueries(['cards', variables.newListId]);
    },
    onError: (error) => {
      console.error('Card move error:', error);
    },
  });
};

/**
 * Hook pour assigner un membre à une carte
 */
export const useAssignMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, memberId }) =>
      cardService.addMemberToCard(cardId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Member assignment error:', error);
    },
  });
};

/**
 * Hook pour retirer un membre d'une carte
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, memberId }) =>
      cardService.removeMemberFromCard(cardId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Member removal error:', error);
    },
  });
};

/**
 * Hook pour ajouter un label à une carte
 */
export const useAddLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, labelId }) =>
      cardService.addLabelToCard(cardId, labelId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Label addition error:', error);
    },
  });
};

/**
 * Hook pour retirer un label d'une carte
 */
export const useRemoveLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, labelId }) =>
      cardService.removeLabelFromCard(cardId, labelId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Label removal error:', error);
    },
  });
};
