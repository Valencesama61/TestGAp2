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

/**
 * Hook to invite a member to a workspace
 */
export const useInviteMemberToWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, email, type, fullName }) =>
      workspaceService.inviteMemberToWorkspace(workspaceId, email, type, fullName),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace', variables.workspaceId, 'members']);
      queryClient.invalidateQueries(['workspace', variables.workspaceId]);
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
    },
  });
};

/**
 * Hook to remove a member from a workspace
 */
export const useRemoveMemberFromWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId }) =>
      workspaceService.removeMemberFromWorkspace(workspaceId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace', variables.workspaceId, 'members']);
      queryClient.invalidateQueries(['workspace', variables.workspaceId]);
    },
    onError: (error) => {
      console.error('Error removing member:', error);
    },
  });
};

/**
 * Hook to update a member's role in a workspace
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId, type }) =>
      workspaceService.updateMemberRole(workspaceId, memberId, type),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace', variables.workspaceId, 'members']);
      queryClient.invalidateQueries(['workspace', variables.workspaceId]);
    },
    onError: (error) => {
      console.error('Error updating member role:', error);
    },
  });
};
