import trelloClient from '../../../api/trello/client';
import { CHECKLISTS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Service pour gérer les opérations liées aux checklists
 */
const checklistService = {
  /**
   * Récupère une checklist par son ID
   * @param {string} checklistId - ID de la checklist
   * @returns {Promise<Object>} Les données de la checklist
   */
  async getChecklistById(checklistId) {
    try {
      const response = await trelloClient.get(
        CHECKLISTS_ENDPOINTS.getById(checklistId),
        {
          params: {
            fields: 'all',
            checkItems: 'all',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la checklist:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les checklists d'une carte
   * @param {string} cardId - ID de la carte
   * @returns {Promise<Array>} Liste des checklists
   */
  async getCardChecklists(cardId) {
    try {
      const response = await trelloClient.get(`/cards/${cardId}/checklists`, {
        params: {
          checkItems: 'all',
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des checklists de la carte:',
        error
      );
      throw error;
    }
  },

  /**
   * Crée une nouvelle checklist sur une carte
   * @param {Object} checklistData - Données de la checklist
   * @param {string} checklistData.idCard - ID de la carte
   * @param {string} checklistData.name - Nom de la checklist
   * @param {number} [checklistData.pos] - Position de la checklist
   * @returns {Promise<Object>} La checklist créée
   */
  async createChecklist(checklistData) {
    try {
      const response = await trelloClient.post(
        CHECKLISTS_ENDPOINTS.create,
        null,
        {
          params: {
            idCard: checklistData.idCard,
            name: checklistData.name,
            pos: checklistData.pos || 'bottom',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la checklist:', error);
      throw error;
    }
  },

  /**
   * Met à jour une checklist
   * @param {string} checklistId - ID de la checklist
   * @param {Object} updates - Données à mettre à jour
   * @param {string} [updates.name] - Nouveau nom
   * @param {number} [updates.pos] - Nouvelle position
   * @returns {Promise<Object>} La checklist mise à jour
   */
  async updateChecklist(checklistId, updates) {
    try {
      const response = await trelloClient.put(
        CHECKLISTS_ENDPOINTS.update(checklistId),
        null,
        {
          params: updates,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la checklist:', error);
      throw error;
    }
  },

  /**
   * Supprime une checklist
   * @param {string} checklistId - ID de la checklist
   * @returns {Promise<void>}
   */
  async deleteChecklist(checklistId) {
    try {
      await trelloClient.delete(CHECKLISTS_ENDPOINTS.delete(checklistId));
    } catch (error) {
      console.error('Erreur lors de la suppression de la checklist:', error);
      throw error;
    }
  },

  /**
   * Récupère les items d'une checklist
   * @param {string} checklistId - ID de la checklist
   * @returns {Promise<Array>} Liste des items
   */
  async getChecklistItems(checklistId) {
    try {
      const response = await trelloClient.get(
        CHECKLISTS_ENDPOINTS.getItems(checklistId)
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des items de la checklist:',
        error
      );
      throw error;
    }
  },

  /**
   * Ajoute un item à une checklist
   * @param {string} checklistId - ID de la checklist
   * @param {Object} itemData - Données de l'item
   * @param {string} itemData.name - Nom de l'item
   * @param {boolean} [itemData.checked] - État de l'item (coché ou non)
   * @param {number} [itemData.pos] - Position de l'item
   * @returns {Promise<Object>} L'item créé
   */
  async addChecklistItem(checklistId, itemData) {
    try {
      const response = await trelloClient.post(
        CHECKLISTS_ENDPOINTS.addItem(checklistId),
        null,
        {
          params: {
            name: itemData.name,
            checked: itemData.checked || false,
            pos: itemData.pos || 'bottom',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'item à la checklist:", error);
      throw error;
    }
  },

  /**
   * Met à jour un item d'une checklist
   * @param {string} checklistId - ID de la checklist
   * @param {string} itemId - ID de l'item
   * @param {Object} updates - Données à mettre à jour
   * @param {string} [updates.name] - Nouveau nom
   * @param {string} [updates.state] - État ('complete' ou 'incomplete')
   * @param {number} [updates.pos] - Nouvelle position
   * @returns {Promise<Object>} L'item mis à jour
   */
  async updateChecklistItem(checklistId, itemId, updates) {
    try {
      const response = await trelloClient.put(
        CHECKLISTS_ENDPOINTS.updateItem(checklistId, itemId),
        null,
        {
          params: updates,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'item de la checklist:",
        error
      );
      throw error;
    }
  },

  /**
   * Supprime un item d'une checklist
   * @param {string} checklistId - ID de la checklist
   * @param {string} itemId - ID de l'item
   * @returns {Promise<void>}
   */
  async deleteChecklistItem(checklistId, itemId) {
    try {
      await trelloClient.delete(
        CHECKLISTS_ENDPOINTS.deleteItem(checklistId, itemId)
      );
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'item de la checklist:",
        error
      );
      throw error;
    }
  },
};

export default checklistService;
