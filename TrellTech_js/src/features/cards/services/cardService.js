import trelloClient from '../../../api/trello/client';
import { CARDS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Service pour gérer les cartes (Cards)
 */
const cardService = {
  /**
   * Récupérer toutes les cartes d'une liste
   * @param {string} listId - ID de la liste
   * @returns {Promise<Array>} Liste des cartes
   */
  getCardsByList: async (listId) => {
    try {
      const response = await trelloClient.get(`/lists/${listId}/cards`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving cards:', error);
      throw error;
    }
  },

  /**
   * Récupérer une carte par son ID
   * @param {string} cardId - ID de la carte
   * @returns {Promise<Object>} Détails de la carte
   */
  getCardById: async (cardId) => {
    try {
      const response = await trelloClient.get(CARDS_ENDPOINTS.getById(cardId), {
        params: {
          fields: 'all',
          members: true,
          member_fields: 'fullName,username,avatarUrl',
          labels: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving card:', error);
      throw error;
    }
  },

  /**
   * Créer une nouvelle carte
   * @param {Object} cardData - Données de la carte
   * @param {string} cardData.name - Nom de la carte (requis)
   * @param {string} cardData.idList - ID de la liste (requis)
   * @param {string} [cardData.desc] - Description de la carte
   * @param {string} [cardData.pos] - Position dans la liste (top, bottom, ou nombre)
   * @param {string} [cardData.due] - Date d'échéance
   * @returns {Promise<Object>} Carte créée
   */
  createCard: async (cardData) => {
    try {
      const response = await trelloClient.post(CARDS_ENDPOINTS.create, null, {
        params: {
          name: cardData.name,
          idList: cardData.idList,
          desc: cardData.desc || '',
          pos: cardData.pos || 'bottom',
          due: cardData.due || null,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating map:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour une carte
   * @param {string} cardId - ID de la carte
   * @param {Object} updates - Champs à mettre à jour
   * @returns {Promise<Object>} Carte mise à jour
   */
  updateCard: async (cardId, updates) => {
    try {
      const response = await trelloClient.put(
        CARDS_ENDPOINTS.update(cardId),
        null,
        { params: updates }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating map:', error);
      throw error;
    }
  },

  /**
   * Supprimer une carte
   * @param {string} cardId - ID de la carte
   * @returns {Promise<void>}
   */
  deleteCard: async (cardId) => {
    try {
      await trelloClient.delete(CARDS_ENDPOINTS.delete(cardId));
    } catch (error) {
      console.error('Error deleting the card:', error);
      throw error;
    }
  },

  /**
   * Déplacer une carte vers une autre liste
   * @param {string} cardId - ID de la carte
   * @param {string} newListId - ID de la nouvelle liste
   * @returns {Promise<Object>} Carte déplacée
   */
  moveCard: async (cardId, newListId) => {
    try {
      const response = await trelloClient.put(
        CARDS_ENDPOINTS.update(cardId),
        null,
        { params: { idList: newListId } }
      );
      return response.data;
    } catch (error) {
      console.error('Error moving the map:', error);
      throw error;
    }
  },

  /**
   * Assigner un membre à une carte
   * @param {string} cardId - ID de la carte
   * @param {string} memberId - ID du membre
   * @returns {Promise<Array>} Liste des membres de la carte
   */
  addMemberToCard: async (cardId, memberId) => {
    try {
      const response = await trelloClient.post(
        CARDS_ENDPOINTS.addMember(cardId),
        null,
        { params: { value: memberId } }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  /**
   * Retirer un membre d'une carte
   * @param {string} cardId - ID de la carte
   * @param {string} memberId - ID du membre
   * @returns {Promise<void>}
   */
  removeMemberFromCard: async (cardId, memberId) => {
    try {
      await trelloClient.delete(CARDS_ENDPOINTS.removeMember(cardId, memberId));
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  },

  /**
   * Récupérer les membres d'une carte
   * @param {string} cardId - ID de la carte
   * @returns {Promise<Array>} Liste des membres
   */
  getCardMembers: async (cardId) => {
    try {
      const response = await trelloClient.get(CARDS_ENDPOINTS.getMembers(cardId));
      return response.data;
    } catch (error) {
      console.error('Error retrieving members:', error);
      throw error;
    }
  },

  /**
   * Ajouter un label à une carte
   * @param {string} cardId - ID de la carte
   * @param {string} labelId - ID du label
   * @returns {Promise<Array>} Liste des labels de la carte
   */
  addLabelToCard: async (cardId, labelId) => {
    try {
      const response = await trelloClient.post(
        CARDS_ENDPOINTS.addLabel(cardId),
        null,
        { params: { value: labelId } }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding label:', error);
      throw error;
    }
  },

  /**
   * Retirer un label d'une carte
   * @param {string} cardId - ID de la carte
   * @param {string} labelId - ID du label
   * @returns {Promise<void>}
   */
  removeLabelFromCard: async (cardId, labelId) => {
    try {
      await trelloClient.delete(CARDS_ENDPOINTS.removeLabel(cardId, labelId));
    } catch (error) {
      console.error('Error removing label:', error);
      throw error;
    }
  },
};

export default cardService;

