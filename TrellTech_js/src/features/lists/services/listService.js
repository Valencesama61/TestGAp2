import trelloClient from '../../../api/trello/client';
import { LISTS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Récupérer une liste par son ID
 */
export const getListById = async (id) => {
  try {
    const response = await trelloClient.get(LISTS_ENDPOINTS.getById(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching list ${id}:`, error);
    throw error;
  }
};

/**
 * Créer une nouvelle liste
 * @param {Object} listData - { name, idBoard, pos? }
 */
export const createList = async (listData) => {
  try {
    const response = await trelloClient.post(LISTS_ENDPOINTS.create, listData);
    return response.data;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

/**
 * Mettre à jour une liste
 * @param {string} id - ID de la liste
 * @param {Object} updates - { name?, closed?, pos? }
 */
export const updateList = async (id, updates) => {
  try {
    const response = await trelloClient.put(LISTS_ENDPOINTS.update(id), updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating list ${id}:`, error);
    throw error;
  }
};

/**
 * Archiver une liste
 * @param {string} id - ID de la liste
 */
export const archiveList = async (id) => {
  try {
    const response = await trelloClient.put(LISTS_ENDPOINTS.archive(id), { value: true });
    return response.data;
  } catch (error) {
    console.error(`Error archiving list ${id}:`, error);
    throw error;
  }
};

/**
 * Récupérer les cartes d'une liste
 * @param {string} id - ID de la liste
 */
export const getListCards = async (id) => {
  try {
    const response = await trelloClient.get(LISTS_ENDPOINTS.getCards(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards for list ${id}:`, error);
    throw error;
  }
};

/**
 * Déplacer toutes les cartes d'une liste vers une autre
 * @param {string} id - ID de la liste source
 * @param {string} idBoard - ID du board de destination
 * @param {string} idList - ID de la liste de destination
 */
export const moveAllCards = async (id, idBoard, idList) => {
  try {
    const response = await trelloClient.post(LISTS_ENDPOINTS.moveAllCards(id), {
      idBoard,
      idList,
    });
    return response.data;
  } catch (error) {
    console.error(`Error moving all cards from list ${id}:`, error);
    throw error;
  }
};
