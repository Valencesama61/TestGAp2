import trelloClient from '../../../api/trello/client';

/**
 * Service pour g�rer les boards
 */
const boardService = {
  /**
   * R�cup�rer tous les boards de l'utilisateur
   */
  getBoards: async () => {
    try {
      const response = await trelloClient.get('/members/me/boards', {
        params: {
          fields: 'id,name,desc,closed,url,prefs',
          filter: 'open',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving boards:', error);
      throw error;
    }
  },

  /**
   * R�cup�rer un board par son ID
   */
  getBoardById: async (boardId) => {
    try {
      const response = await trelloClient.get(`/boards/${boardId}`, {
        params: {
          fields: 'all',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving board:', error);
      throw error;
    }
  },

  /**
   * R�cup�rer les listes d'un board
   */
  getBoardLists: async (boardId) => {
    try {
      const response = await trelloClient.get(`/boards/${boardId}/lists`, {
        params: {
          fields: 'id,name,closed,pos',
          filter: 'open',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving board lists:', error);
      throw error;
    }
  },

  /**
   * Cr�er un nouveau board
   */
  createBoard: async (name, desc = '') => {
    try {
      const response = await trelloClient.post('/boards', null, {
        params: {
          name,
          desc,
          defaultLists: false,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un board
   */
  updateBoard: async (boardId, updates) => {
    try {
      const response = await trelloClient.put(`/boards/${boardId}`, null, {
        params: updates,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  },

  /**
   * Supprimer un board
   */
  deleteBoard: async (boardId) => {
    try {
      await trelloClient.delete(`/boards/${boardId}`);
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  },

  /**
   * Archiver un board
   */
  archiveBoard: async (boardId) => {
    try {
      const response = await trelloClient.put(`/boards/${boardId}`, null, {
        params: {
          closed: 'true',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error archiving board:', error);
      throw error;
    }
  },
};

export default boardService;
