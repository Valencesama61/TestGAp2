import trelloClient from '../../../api/trello/client';

/**
 * Service pour gérer les workspaces (Organizations)
 */
const workspaceService = {
  /**
   * Récupérer tous les workspaces de l'utilisateur
   */
  getWorkspaces: async () => {
    try {
      const response = await trelloClient.get('/members/me/organizations', {
        params: {
          fields: 'id,name,displayName,desc,url',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving workspaces:', error);
      throw error;
    }
  },

  /**
   * Récupérer un workspace par son ID
   */
  getWorkspaceById: async (workspaceId) => {
    try {
      const response = await trelloClient.get(`/organizations/${workspaceId}`, {
        params: {
          fields: 'all',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving workspace:', error);
      throw error;
    }
  },

  /**
   * Récupérer les boards d'un workspace
   */
  getWorkspaceBoards: async (workspaceId) => {
    try {
      const response = await trelloClient.get(`/organizations/${workspaceId}/boards`, {
        params: {
          fields: 'id,name,desc,closed,url',
          filter: 'open',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving workspace boards:', error);
      throw error;
    }
  },
};

export default workspaceService;
