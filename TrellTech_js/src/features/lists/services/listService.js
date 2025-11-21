// listService.js - CORRECTION
import trelloClient from '../../../api/trello/client';

const listService = {
  /**
   * Récupérer une liste par son ID
   */
  getListById: async (listId) => {
    try {
      const response = await trelloClient.get(`/lists/${listId}`, {
        params: {
          fields: 'id,name,closed,idBoard,pos',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving list:', error);
      throw error;
    }
  },

  /**
   * Récupérer les cartes d'une liste
   */
  getListCards: async (listId) => {
    try {
      const response = await trelloClient.get(`/lists/${listId}/cards`, {
        params: {
          fields: 'id,name,desc,due,dueComplete,labels,idMembers,idList,idBoard',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving list cards:', error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle liste - CORRECTION
   */
  createList: async (boardId, name) => {
    try {
      const payload = new URLSearchParams();
      payload.append('name', name);
      payload.append('idBoard', boardId);
      payload.append('pos', 'bottom');

      const response = await trelloClient.post('/lists', payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une liste - CORRECTION
   */
  updateList: async (listId, name) => {
    try {
      const payload = new URLSearchParams();
      payload.append('name', name);

      const response = await trelloClient.put(`/lists/${listId}`, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  },

  /**
   * Archiver une liste - CORRECTION
   */
  archiveList: async (listId) => {
    try {
      const payload = new URLSearchParams();
      payload.append('value', 'true');

      const response = await trelloClient.put(`/lists/${listId}/closed`, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data;
    } catch (error) {
      console.error('Error archiving list:', error);
      throw error;
    }
  },

  /**
   * Déplacer toutes les cartes d'une liste vers une autre - CORRECTION
   */
  moveAllCards: async (sourceListId, targetListId, idBoard) => {
    try {
      const payload = new URLSearchParams();
      payload.append('idBoard', idBoard);
      payload.append('idList', targetListId);

      const response = await trelloClient.post(
        `/lists/${sourceListId}/moveAllCards`,
        payload.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error moving all cards:', error);
      throw error;
    }
  },
};

export default listService;