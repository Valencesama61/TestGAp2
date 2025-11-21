// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import boardService from '../services/boardService';

// /**
//  * Hook pour cr�er un board
//  */
// export const useCreateBoard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ name, desc }) => boardService.createBoard(name, desc),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['boards']);
//     },
//     onError: (error) => {
//       console.error('Board creation error:', error);
//     },
//   });
// };

// /**
//  * Hook pour mettre � jour un board
//  */
// export const useUpdateBoard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ boardId, updates }) => boardService.updateBoard(boardId, updates),
//     onSuccess: (updatedBoard) => {
//       queryClient.invalidateQueries(['board', updatedBoard.id]);
//       queryClient.invalidateQueries(['boards']);
//     },
//     onError: (error) => {
//       console.error('Board update error:', error);
//     },
//   });
// };

// /**
//  * Hook pour supprimer un board
//  */
// export const useDeleteBoard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (boardId) => boardService.deleteBoard(boardId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['boards']);
//     },
//     onError: (error) => {
//       console.error('Board deletion error:', error);
//     },
//   });
// };

// /**
//  * Hook pour archiver un board
//  */
// export const useArchiveBoard = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (boardId) => boardService.archiveBoard(boardId),
//     onSuccess: (archivedBoard) => {
//       queryClient.invalidateQueries(['board', archivedBoard.id]);
//       queryClient.invalidateQueries(['boards']);
//     },
//     onError: (error) => {
//       console.error('Board archiving error:', error);
//     },
//   });
// };


// hooks/useBoardActions.js - CORRECTION AVEC TEMPLATES
import { useMutation, useQueryClient } from '@tanstack/react-query';
import boardService from '../services/boardService';

/**
 * Hook pour créer un board avec template
 */
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, desc, idOrganization, template = 'kanban' }) => 
      boardService.createBoard(name, desc, idOrganization, template),
    onSuccess: (data) => {
      console.log('🔄 Invalidation des caches après création du board');
      
      // Invalider le cache des boards du workspace
      if (data.idOrganization) {
        queryClient.invalidateQueries(['workspace-boards', data.idOrganization]);
      }
      
      // Invalider le cache général des boards
      queryClient.invalidateQueries(['boards']);
    },
    onError: (error) => {
      console.error('❌ Erreur création board:', error);
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
    onSuccess: (data) => {
      queryClient.invalidateQueries(['board', data.id]);
      if (data.idOrganization) {
        queryClient.invalidateQueries(['workspace-boards', data.idOrganization]);
      }
      queryClient.invalidateQueries(['boards']);
    },
  });
};

/**
 * Hook pour supprimer un board
 */
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, workspaceId }) => boardService.deleteBoard(boardId),
    onSuccess: (_, variables) => {
      if (variables.workspaceId) {
        queryClient.invalidateQueries(['workspace-boards', variables.workspaceId]);
      }
      queryClient.invalidateQueries(['boards']);
    },
  });
};