import { useQuery } from '@tanstack/react-query';
import workspaceService from '../services/workspaceService';

/**
 * Hook to get all workspaces
 */
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceService.getWorkspaces(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook to get a workspace
 */
export const useWorkspace = (workspaceId) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * Hook to get boards for a workspace
 */
export const useWorkspaceBoards = (workspaceId) => {
  return useQuery({
    queryKey: ['workspace-boards', workspaceId],
    queryFn: () => workspaceService.getWorkspaceBoards(workspaceId),
    enabled: !!workspaceId,
  });
};
