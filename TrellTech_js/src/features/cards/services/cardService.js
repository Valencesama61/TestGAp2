import trelloClient from '../../../api/trello/client';
import { CARDS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Récupérer une carte par son ID
 */
export const getCardById = async (id) => {
  try {
    const response = await trelloClient.get(CARDS_ENDPOINTS.getById(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching card ${id}:`, error);
    throw error;
  }
};

/**
 * Créer une nouvelle carte
 * @param {Object} cardData - { name, idList, desc?, due?, pos? }
 */
export const createCard = async (cardData) => {
  try {
    const response = await trelloClient.post(CARDS_ENDPOINTS.create, cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

/**
 * Mettre à jour une carte
 * @param {string} id - ID de la carte
 * @param {Object} updates - { name?, desc?, idList?, pos?, due?, dueComplete? }
 */
export const updateCard = async (id, updates) => {
  try {
    const response = await trelloClient.put(CARDS_ENDPOINTS.update(id), updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating card ${id}:`, error);
    throw error;
  }
};

/**
 * Supprimer une carte
 * @param {string} id - ID de la carte
 */
export const deleteCard = async (id) => {
  try {
    const response = await trelloClient.delete(CARDS_ENDPOINTS.delete(id));
    return response.data;
  } catch (error) {
    console.error(`Error deleting card ${id}:`, error);
    throw error;
  }
};

/**
 * Ajouter un membre à une carte
 * @param {string} id - ID de la carte
 * @param {string} memberId - ID du membre
 */
export const addMemberToCard = async (id, memberId) => {
  try {
    const response = await trelloClient.post(CARDS_ENDPOINTS.addMember(id), {
      value: memberId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding member to card ${id}:`, error);
    throw error;
  }
};

/**
 * Retirer un membre d'une carte
 * @param {string} cardId - ID de la carte
 * @param {string} memberId - ID du membre
 */
export const removeMemberFromCard = async (cardId, memberId) => {
  try {
    const response = await trelloClient.delete(
      CARDS_ENDPOINTS.removeMember(cardId, memberId)
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing member from card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Récupérer les membres d'une carte
 * @param {string} id - ID de la carte
 */
export const getCardMembers = async (id) => {
  try {
    const response = await trelloClient.get(CARDS_ENDPOINTS.getMembers(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching members for card ${id}:`, error);
    throw error;
  }
};

/**
 * Ajouter un label à une carte
 * @param {string} id - ID de la carte
 * @param {string} labelId - ID du label
 */
export const addLabelToCard = async (id, labelId) => {
  try {
    const response = await trelloClient.post(CARDS_ENDPOINTS.addLabel(id), {
      value: labelId,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding label to card ${id}:`, error);
    throw error;
  }
};

/**
 * Retirer un label d'une carte
 * @param {string} cardId - ID de la carte
 * @param {string} labelId - ID du label
 */
export const removeLabelFromCard = async (cardId, labelId) => {
  try {
    const response = await trelloClient.delete(
      CARDS_ENDPOINTS.removeLabel(cardId, labelId)
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing label from card ${cardId}:`, error);
    throw error;
  }
};

/**
 * Récupérer les commentaires d'une carte
 * @param {string} id - ID de la carte
 */
export const getCardComments = async (id) => {
  try {
    const response = await trelloClient.get(CARDS_ENDPOINTS.getComments(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for card ${id}:`, error);
    throw error;
  }
};

/**
 * Ajouter un commentaire à une carte
 * @param {string} id - ID de la carte
 * @param {string} text - Texte du commentaire
 */
export const addCommentToCard = async (id, text) => {
  try {
    const response = await trelloClient.post(CARDS_ENDPOINTS.addComment(id), {
      text,
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to card ${id}:`, error);
    throw error;
  }
};
