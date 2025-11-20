import trelloClient from '../../../api/trello/client';

/**
 * Service pour g�rer les workspaces (Organizations)
 */
const workspaceService = {
  /**
   * R�cup�rer tous les workspaces de l'utilisateur
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
   * R�cup�rer un workspace par son ID
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
   * R�cup�rer les boards d'un workspace
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

  /**
   * Créer un nouveau workspace
   * Note: Nécessite des permissions spéciales
   */
  createWorkspace: async (displayName, desc = '') => {
    try {
      const response = await trelloClient.post('/organizations', null, {
        params: {
          displayName,
          desc,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un workspace
   */
  updateWorkspace: async (workspaceId, updates) => {
    try {
      const response = await trelloClient.put(`/organizations/${workspaceId}`, null, {
        params: updates,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },

  /**
   * Supprimer un workspace
   */
  deleteWorkspace: async (workspaceId) => {
    try {
      await trelloClient.delete(`/organizations/${workspaceId}`);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  },
};

export default workspaceService;
