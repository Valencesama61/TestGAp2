import trelloClient from '../../../api/trello/client';
import { LABELS_ENDPOINTS, BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Service pour gérer les opérations liées aux labels
 */
const labelService = {
  /**
   * Récupère un label par son ID
   * @param {string} labelId - ID du label
   * @returns {Promise<Object>} Les données du label
   */
  async getLabelById(labelId) {
    try {
      const response = await trelloClient.get(LABELS_ENDPOINTS.getById(labelId));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du label:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les labels d'un board
   * @param {string} boardId - ID du board
   * @returns {Promise<Array>} Liste des labels
   */
  async getBoardLabels(boardId) {
    try {
      const response = await trelloClient.get(
        `${BOARDS_ENDPOINTS.getById(boardId)}/labels`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des labels du board:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau label sur un board
   * @param {Object} labelData - Données du label
   * @param {string} labelData.name - Nom du label
   * @param {string} labelData.color - Couleur du label (ex: 'green', 'yellow', 'red')
   * @param {string} labelData.idBoard - ID du board
   * @returns {Promise<Object>} Le label créé
   */
  async createLabel(labelData) {
    try {
      const response = await trelloClient.post(LABELS_ENDPOINTS.create, null, {
        params: {
          name: labelData.name,
          color: labelData.color,
          idBoard: labelData.idBoard,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du label:', error);
      throw error;
    }
  },

  /**
   * Met à jour un label
   * @param {string} labelId - ID du label
   * @param {Object} updates - Données à mettre à jour
   * @param {string} [updates.name] - Nouveau nom
   * @param {string} [updates.color] - Nouvelle couleur
   * @returns {Promise<Object>} Le label mis à jour
   */
  async updateLabel(labelId, updates) {
    try {
      const response = await trelloClient.put(
        LABELS_ENDPOINTS.update(labelId),
        null,
        {
          params: updates,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du label:', error);
      throw error;
    }
  },

  /**
   * Supprime un label
   * @param {string} labelId - ID du label
   * @returns {Promise<void>}
   */
  async deleteLabel(labelId) {
    try {
      await trelloClient.delete(LABELS_ENDPOINTS.delete(labelId));
    } catch (error) {
      console.error('Erreur lors de la suppression du label:', error);
      throw error;
    }
  },

  /**
   * Ajoute un label à une carte
   * @param {string} cardId - ID de la carte
   * @param {string} labelId - ID du label
   * @returns {Promise<Object>} Les données mises à jour
   */
  async addLabelToCard(cardId, labelId) {
    try {
      const response = await trelloClient.post(
        `/cards/${cardId}/idLabels`,
        null,
        {
          params: { value: labelId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du label à la carte:', error);
      throw error;
    }
  },

  /**
   * Retire un label d'une carte
   * @param {string} cardId - ID de la carte
   * @param {string} labelId - ID du label
   * @returns {Promise<void>}
   */
  async removeLabelFromCard(cardId, labelId) {
    try {
      await trelloClient.delete(`/cards/${cardId}/idLabels/${labelId}`);
    } catch (error) {
      console.error('Erreur lors du retrait du label de la carte:', error);
      throw error;
    }
  },
};

export default labelService;
