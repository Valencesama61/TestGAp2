import trelloClient from '../../../api/trello/client';
import { LISTS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Service pour gérer les listes
 */
const listService = {
  /**
   * Récupérer une liste par son ID
   */
  getListById: async (listId) => {
    try {
      const response = await trelloClient.get(LISTS_ENDPOINTS.getById(listId), {
        params: {
          fields: 'all',
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
      const response = await trelloClient.get(LISTS_ENDPOINTS.getCards(listId), {
        params: {
          fields: 'id,name,desc,due,dueComplete,labels',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving list cards:', error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle liste
   */
  createList: async (boardId, name) => {
    try {
      const response = await trelloClient.post(LISTS_ENDPOINTS.create, null, {
        params: {
          name,
          idBoard: boardId,
          pos: 'bottom',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une liste
   */
  updateList: async (listId, name) => {
    try {
      const response = await trelloClient.put(LISTS_ENDPOINTS.update(listId), null, {
        params: { name },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  },

  /**
   * Supprimer une liste
   */
  deleteList: async (listId) => {
    try {
      await trelloClient.delete(LISTS_ENDPOINTS.delete(listId));
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  },

  /**
   * Archiver une liste
   */
  archiveList: async (listId) => {
    try {
      const response = await trelloClient.put(LISTS_ENDPOINTS.archive(listId), null, {
        params: { value: true },
      });
      return response.data;
    } catch (error) {
      console.error('Error archiving list:', error);
      throw error;
    }
  },

  /**
   * Déplacer toutes les cartes d'une liste vers une autre
   */
  moveAllCards: async (sourceListId, targetListId) => {
    try {
      const response = await trelloClient.post(
        LISTS_ENDPOINTS.moveAllCards(sourceListId),
        null,
        {
          params: {
            idBoard: targetListId,
            idList: targetListId,
          },
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
