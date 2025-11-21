import trelloClient from '../../../api/trello/client';
import { WORKSPACES_ENDPOINTS } from '../../../api/trello/endpoints';

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

  /**
   * Get members of a workspace
   */
  getWorkspaceMembers: async (workspaceId) => {
    try {
      const response = await trelloClient.get(WORKSPACES_ENDPOINTS.getMembers(workspaceId), {
        params: {
          fields: 'id,fullName,username,avatarUrl,initials',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving workspace members:', error);
      throw error;
    }
  },

  /**
   * Invite a member to a workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} email - Email du membre à inviter
   * @param {string} type - Type de membre: 'normal' ou 'admin' (défaut: 'normal')
   * @param {string} fullName - Nom complet (optionnel)
   */
  inviteMemberToWorkspace: async (workspaceId, email, type = 'normal', fullName = '') => {
    try {
      console.log('Inviting member to workspace:', { workspaceId, email, type });

      const response = await trelloClient.put(
        WORKSPACES_ENDPOINTS.inviteMember(workspaceId),
        {},  // Body vide
        {
          params: {
            email,
            type,
            ...(fullName && { fullName }),
          },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Member invited successfully');
      return response.data;
    } catch (error) {
      console.error('Error inviting member to workspace:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  /**
   * Remove a member from a workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} memberId - ID du membre à retirer
   */
  removeMemberFromWorkspace: async (workspaceId, memberId) => {
    try {
      console.log('Removing member from workspace:', { workspaceId, memberId });
      await trelloClient.delete(WORKSPACES_ENDPOINTS.removeMember(workspaceId, memberId));
      console.log('Member removed successfully');
    } catch (error) {
      console.error('Error removing member from workspace:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update a member's role in a workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} memberId - ID du membre
   * @param {string} type - Nouveau type: 'normal' ou 'admin'
   */
  updateMemberRole: async (workspaceId, memberId, type) => {
    try {
      console.log('Updating member role:', { workspaceId, memberId, type });

      const response = await trelloClient.put(
        WORKSPACES_ENDPOINTS.updateMemberRole(workspaceId, memberId),
        {},  // Body vide
        {
          params: { type },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Member role updated successfully');
      return response.data;
    } catch (error) {
      console.error('Error updating member role:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },
};

export default workspaceService;
