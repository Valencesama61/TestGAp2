// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import cardService from '../services/cardService';

// /**
//  * Hook pour récupérer les cartes d'une liste
//  * @param {string} listId - ID de la liste
//  */
// export const useCards = (listId) => {
//   return useQuery({
//     queryKey: ['cards', listId],
//     queryFn: () => cardService.getCardsByList(listId),
//     enabled: !!listId, // Ne lance la requête que si listId existe
//     staleTime: 30000, 
//   });
// };

// /**
//  * Hook pour récupérer une carte spécifique
//  * @param {string} cardId - ID de la carte
//  */
// export const useCard = (cardId) => {
//   return useQuery({
//     queryKey: ['card', cardId],
//     queryFn: () => cardService.getCardById(cardId),
//     enabled: !!cardId,
//   });
// };

// /**
//  * Hook pour créer une carte
//  */
// export const useCreateCard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (cardData) => cardService.createCard(cardData),
//     onSuccess: (newCard) => {
//       // Invalider le cache des cartes de la liste
//       queryClient.invalidateQueries(['cards', newCard.idList]);
//     },
//     onError: (error) => {
//       console.error('Card creation error:', error);
//     },
//   });
// };

// /**
//  * Hook pour mettre à jour une carte
//  */
// export const useUpdateCard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cardId, updates }) => cardService.updateCard(cardId, updates),
//     onSuccess: (updatedCard) => {
//       // Invalider le cache
//       queryClient.invalidateQueries(['card', updatedCard.id]);
//       queryClient.invalidateQueries(['cards', updatedCard.idList]);
//     },
//   });
// };

// /**
//  * Hook pour supprimer une carte
//  */
// export const useDeleteCard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cardId, listId }) => cardService.deleteCard(cardId),
//     onSuccess: (_, variables) => {
//       // Invalider le cache de la liste
//       queryClient.invalidateQueries(['cards', variables.listId]);
//     },
//   });
// };

// /**
//  * Hook pour déplacer une carte
//  */
// export const useMoveCard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cardId, newListId, oldListId }) => 
//       cardService.moveCard(cardId, newListId),
//     onSuccess: (_, variables) => {
//       // Invalider les deux listes
//       queryClient.invalidateQueries(['cards', variables.oldListId]);
//       queryClient.invalidateQueries(['cards', variables.newListId]);
//     },
//   });
// };

// /**
//  * Hook pour récupérer les membres d'une carte
//  */
// export const useCardMembers = (cardId) => {
//   return useQuery({
//     queryKey: ['card-members', cardId],
//     queryFn: () => cardService.getCardMembers(cardId),
//     enabled: !!cardId,
//   });
// };

// /**
//  * Hook pour récupérer les membres d'un board
//  */
// export const useBoardMembers = (boardId) => {
//   return useQuery({
//     queryKey: ['board-members', boardId],
//     queryFn: () => cardService.getBoardMembers(boardId),
//     enabled: !!boardId,
//   });
// };


// /**
//  * Hook pour assigner un membre à une carte
//  */
// export const useAssignMember = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cardId, memberId }) => 
//       cardService.addMemberToCard(cardId, memberId),
//     onSuccess: (data, variables) => {
//       // Invalider le cache des membres de la carte
//       queryClient.invalidateQueries(['card-members', variables.cardId]);
//       // Invalider le cache de la carte elle-même
//       queryClient.invalidateQueries(['card', variables.cardId]);
//     },
//     onError: (error) => {
//       console.error('Error assigning member:', error);
//     },
//   });
// };

// /**
//  * Hook pour retirer un membre d'une carte
//  */
// export const useRemoveMember = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ cardId, memberId }) => 
//       cardService.removeMemberFromCard(cardId, memberId),
//     onSuccess: (data, variables) => {
//       // Invalider le cache des membres de la carte
//       queryClient.invalidateQueries(['card-members', variables.cardId]);
//       // Invalider le cache de la carte elle-même
//       queryClient.invalidateQueries(['card', variables.cardId]);
//     },
//     onError: (error) => {
//       console.error('Error removing member:', error);
//     },
//   });
// };


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cardService from '../services/cardService';

/**
 * Hook pour récupérer les cartes d'une liste
 */
export const useCards = (listId) => {
  return useQuery({
    queryKey: ['cards', listId],
    queryFn: () => cardService.getCardsByList(listId),
    enabled: !!listId,
    staleTime: 30000, 
  });
};

/**
 * Hook pour récupérer une carte spécifique
 */
export const useCard = (cardId) => {
  return useQuery({
    queryKey: ['card', cardId],
    queryFn: () => cardService.getCardById(cardId),
    enabled: !!cardId,
  });
};

/**
 * Hook pour récupérer les membres d'une carte
 */
export const useCardMembers = (cardId) => {
  return useQuery({
    queryKey: ['card-members', cardId],
    queryFn: () => cardService.getCardMembers(cardId),
    enabled: !!cardId,
  });
};

/**
 * Hook pour récupérer les membres d'un board
 */
export const useBoardMembers = (boardId) => {
  return useQuery({
    queryKey: ['board-members', boardId],
    queryFn: () => cardService.getBoardMembers(boardId),
    enabled: !!boardId,
  });
};

/**
 * Hook pour créer une carte
 */
export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardData) => cardService.createCard(cardData),
    onSuccess: (newCard) => {
      queryClient.invalidateQueries(['cards', newCard.idList]);
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
  });
};

/**
 * Hook pour déplacer une carte
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['card-members', variables.cardId]);
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Error assigning member:', error);
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['card-members', variables.cardId]);
      queryClient.invalidateQueries(['card', variables.cardId]);
    },
    onError: (error) => {
      console.error('Error removing member:', error);
    },
  });
};

// Export par défaut pour la compatibilité
export default {
  useCards,
  useCard,
  useCardMembers,
  useBoardMembers,
  useCreateCard,
  useUpdateCard,
  useDeleteCard,
  useMoveCard,
  useAssignMember,
  useRemoveMember,
};