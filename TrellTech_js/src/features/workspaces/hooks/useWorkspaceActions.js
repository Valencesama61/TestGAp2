import { useMutation, useQueryClient } from '@tanstack/react-query';
import workspaceService from '../services/workspaceService';

/**
 * Hook pour créer un workspace
 * Note: La création de workspaces (organizations) nécessite généralement
 * des permissions spéciales dans Trello
 */
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ displayName, desc }) =>
      workspaceService.createWorkspace(displayName, desc),
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
    },
    onError: (error) => {
      console.error('Workspace creation error:', error);
    },
  });
};

/**
 * Hook pour mettre à jour un workspace
 */
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, updates }) =>
      workspaceService.updateWorkspace(workspaceId, updates),
    onSuccess: (updatedWorkspace) => {
      queryClient.invalidateQueries(['workspace', updatedWorkspace.id]);
      queryClient.invalidateQueries(['workspaces']);
    },
    onError: (error) => {
      console.error('Workspace update error:', error);
    },
  });
};

/**
 * Hook pour supprimer un workspace
 * Note: Nécessite des permissions d'administrateur
 */
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId) => workspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries(['workspaces']);
    },
    onError: (error) => {
      console.error('Workspace deletion error:', error);
    },
  });
};
