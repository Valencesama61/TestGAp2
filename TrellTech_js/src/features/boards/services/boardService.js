import trelloClient from '../../../api/trello/client';

/**
 * Service pour gérer les boards
 */
const boardService = {
  /**
   * Récupérer tous les boards de l'utilisateur
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
   * Récupérer un board par son ID
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
   * Récupérer les listes d'un board
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
   * Créer un nouveau board
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
};

export default boardService;
