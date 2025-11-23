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

  /**
   * Inviter un membre à un workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} email - Email du membre à inviter
   * @param {string} fullName - Nom complet du membre (optionnel)
   * @param {string} role - Rôle: 'admin', 'normal', 'observer' (défaut: 'normal')
   * @returns {Promise<Object>} Résultat de l'invitation
   */
  inviteMemberToWorkspace: async (workspaceId, email, fullName = '', role = 'normal') => {
    try {
      const payload = new URLSearchParams();
      payload.append('email', email);
      if (fullName) payload.append('fullName', fullName);
      payload.append('type', role); 

      const response = await trelloClient.post(
        `/organizations/${workspaceId}/memberships`,
        payload.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      
      console.log('Membre invité avec succès:', { email, role });
      return response.data;
    } catch (error) {
      console.error('Error inviting member to workspace:', error);
      console.error('Détails:', error.response?.data);
      throw error;
    }
  },

   /**
   * Récupérer tous les membres d'un workspace
   * @param {string} workspaceId - ID du workspace
   * @returns {Promise<Array>} Liste des membres
   */
  getWorkspaceMembers: async (workspaceId) => {
    try {
      const response = await trelloClient.get(`/organizations/${workspaceId}/members`, {
        params: {
          fields: 'id,fullName,username,email,avatarUrl,initials,memberType',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving workspace members:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le rôle d'un membre dans un workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} memberId - ID du membre
   * @param {string} role - Nouveau rôle: 'admin', 'normal', 'observer'
   * @returns {Promise<Object>} Résultat de la mise à jour
   */
  updateMemberRole: async (workspaceId, memberId, role) => {
    try {
      const payload = new URLSearchParams();
      payload.append('type', role);

      const response = await trelloClient.put(
        `/organizations/${workspaceId}/members/${memberId}`,
        payload.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      
      console.log('Rôle mis à jour:', { memberId, role });
      return response.data;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  },

  /**
   * Retirer un membre d'un workspace
   * @param {string} workspaceId - ID du workspace
   * @param {string} memberId - ID du membre
   * @returns {Promise<void>}
   */
  removeMemberFromWorkspace: async (workspaceId, memberId) => {
    try {
      await trelloClient.delete(`/organizations/${workspaceId}/members/${memberId}`);
      console.log('Membre retiré du workspace:', memberId);
    } catch (error) {
      console.error('Error removing member from workspace:', error);
      throw error;
    }
  },

  /**
   * Récupérer les invitations en attente d'un workspace
   * @param {string} workspaceId - ID du workspace
   * @returns {Promise<Array>} Liste des invitations
   */
  getPendingInvitations: async (workspaceId) => {
    try {
      const response = await trelloClient.get(`/organizations/${workspaceId}/memberships`, {
        params: {
          filter: 'invited',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving pending invitations:', error);
      throw error;
    }
  },
};

export default workspaceService;
