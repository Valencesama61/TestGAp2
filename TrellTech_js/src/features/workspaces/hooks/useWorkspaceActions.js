import { useMutation, useQueryClient } from '@tanstack/react-query';
import workspaceService from '../services/workspaceService';

/**
 * Hook to create a workspace
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
 * Hook to update a workspace
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
 * Hook to delete a workspace
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
