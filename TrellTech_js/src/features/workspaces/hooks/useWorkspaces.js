import { useQuery } from '@tanstack/react-query';
import workspaceService from '../services/workspaceService';

/**
 * Hook pour récupérer tous les workspaces
 */
export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceService.getWorkspaces(),
    staleTime: 60000, // 1 minute
  });
};

/**
 * Hook pour récupérer un workspace spécifique
 */
export const useWorkspace = (workspaceId) => {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
};

/**
 * Hook pour récupérer les boards d'un workspace
 */
export const useWorkspaceBoards = (workspaceId) => {
  return useQuery({
    queryKey: ['workspace-boards', workspaceId],
    queryFn: () => workspaceService.getWorkspaceBoards(workspaceId),
    enabled: !!workspaceId,
  });
};
