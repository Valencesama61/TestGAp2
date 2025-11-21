import trelloClient from '../../../api/trello/client';


const workspaceService = {
  /**
   *get all workspace for the user
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
   * Get a workspace
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
   * get boards from a workspace
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
   * create a workspace
   */

  createWorkspace: async (displayName, desc = '') => {
    try {
      const payload = new URLSearchParams();
      payload.append('displayName', displayName);
      payload.append('desc', desc);
  
      const response = await trelloClient.post('/organizations', payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },
  

  /**
   * update a workspace
   */

  updateWorkspace: async (workspaceId, updates) => {
    try {
      const payload = new URLSearchParams();
  
      if (updates.displayName) payload.append('displayName', updates.displayName);
      if (updates.desc) payload.append('desc', updates.desc);
  
      const response = await trelloClient.put(
        `/organizations/${workspaceId}`,
        payload.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
  
      return response.data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },
  

  /**
   * delete a workspace
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
