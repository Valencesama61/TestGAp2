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
   * Récupérer tous les membres disponibles du board
   */
  getBoardMembers: async (boardId) => {
    try {
      const response = await trelloClient.get(`/boards/${boardId}/members`, {
        params: {
          fields: 'id,fullName,username,avatarUrl,initials',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving board members:', error);
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
    const payload = new URLSearchParams();
    payload.append('name', cardData.name);
    payload.append('idList', cardData.idList);
    if (cardData.desc) payload.append('desc', cardData.desc);
    if (cardData.pos) payload.append('pos', cardData.pos);
    if (cardData.due) payload.append('due', cardData.due);

    const response = await trelloClient.post(CARDS_ENDPOINTS.create, payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error); // Correction du message
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
    const payload = new URLSearchParams();
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && updates[key] !== null) {
        payload.append(key, updates[key]);
      }
    });

    const response = await trelloClient.put(
      CARDS_ENDPOINTS.update(cardId),
      payload.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating card:', error); // Correction du message
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
      console.log('Adding member to card:', { cardId, memberId });

      // L'API Trello attend le paramètre 'value' comme query parameter
      const response = await trelloClient.post(
        CARDS_ENDPOINTS.addMember(cardId),
        {},  // Body vide
        {
          params: { value: memberId },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log('Member added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding member:', error);
      console.error('Error details:', error.response?.data);
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
      console.log('Removing member from card:', { cardId, memberId });
      await trelloClient.delete(CARDS_ENDPOINTS.removeMember(cardId, memberId));
      console.log('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      console.error('Error details:', error.response?.data);
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
      const response = await trelloClient.get(CARDS_ENDPOINTS.getMembers(cardId), {
        params: {
          fields: 'id,fullName,username,avatarUrl,initials',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving members:', error);
      console.error('Error details:', error.response?.data);
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
      console.log('Adding label to card:', { cardId, labelId });
      const response = await trelloClient.post(
        CARDS_ENDPOINTS.addLabel(cardId),
        {},  // Body vide
        {
          params: { value: labelId },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log('Label added successfully');
      return response.data;
    } catch (error) {
      console.error('Error adding label:', error);
      console.error('Error details:', error.response?.data);
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
      console.log('Removing label from card:', { cardId, labelId });
      await trelloClient.delete(CARDS_ENDPOINTS.removeLabel(cardId, labelId));
      console.log('Label removed successfully');
    } catch (error) {
      console.error('Error removing label:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  },
};

export default cardService;

