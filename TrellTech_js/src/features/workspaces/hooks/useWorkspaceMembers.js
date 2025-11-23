import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import workspaceService from '../services/workspaceService';

/**
 * Hook pour récupérer les membres d'un workspace
 */
export const useWorkspaceMembers = (workspaceId) => {
  return useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * Hook pour inviter un membre à un workspace
 */
export const useInviteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, email, fullName, role }) =>
      workspaceService.inviteMemberToWorkspace(workspaceId, email, fullName, role),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace-members', variables.workspaceId]);
    },
    onError: (error) => {
      console.error('Error inviting member:', error);
    },
  });
};

/**
 * Hook pour mettre à jour le rôle d'un membre
 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId, role }) =>
      workspaceService.updateMemberRole(workspaceId, memberId, role),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace-members', variables.workspaceId]);
    },
  });
};

/**
 * Hook pour retirer un membre d'un workspace
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, memberId }) =>
      workspaceService.removeMemberFromWorkspace(workspaceId, memberId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['workspace-members', variables.workspaceId]);
    },
  });
};

/**
 * Hook pour récupérer les invitations en attente
 */
export const usePendingInvitations = (workspaceId) => {
  return useQuery({
    queryKey: ['pending-invitations', workspaceId],
    queryFn: () => workspaceService.getPendingInvitations(workspaceId),
    enabled: !!workspaceId,
  });
};