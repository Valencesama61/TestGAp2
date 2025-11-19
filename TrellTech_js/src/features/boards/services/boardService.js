import trelloClient from '../../../api/trello/client';
import { BOARDS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Récupérer tous les boards de l'utilisateur
 */
export const getBoards = async () => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getAll);
    return response.data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};

/**
 * Récupérer un board par son ID
 */
export const getBoardById = async (id) => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getById(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching board ${id}:`, error);
    throw error;
  }
};

/**
 * Créer un nouveau board
 * @param {Object} boardData - { name, desc?, idOrganization? }
 */
export const createBoard = async (boardData) => {
  try {
    const response = await trelloClient.post(BOARDS_ENDPOINTS.create, boardData);
    return response.data;
  } catch (error) {
    console.error('Error creating board:', error);
    throw error;
  }
};

/**
 * Mettre à jour un board
 * @param {string} id - ID du board
 * @param {Object} updates - { name?, desc?, closed? }
 */
export const updateBoard = async (id, updates) => {
  try {
    const response = await trelloClient.put(BOARDS_ENDPOINTS.update(id), updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating board ${id}:`, error);
    throw error;
  }
};

/**
 * Supprimer un board
 * @param {string} id - ID du board
 */
export const deleteBoard = async (id) => {
  try {
    const response = await trelloClient.delete(BOARDS_ENDPOINTS.delete(id));
    return response.data;
  } catch (error) {
    console.error(`Error deleting board ${id}:`, error);
    throw error;
  }
};

/**
 * Récupérer les listes d'un board
 * @param {string} id - ID du board
 */
export const getBoardLists = async (id) => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getLists(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching lists for board ${id}:`, error);
    throw error;
  }
};

/**
 * Récupérer les cartes d'un board
 * @param {string} id - ID du board
 */
export const getBoardCards = async (id) => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getCards(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching cards for board ${id}:`, error);
    throw error;
  }
};

/**
 * Récupérer les membres d'un board
 * @param {string} id - ID du board
 */
export const getBoardMembers = async (id) => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getMembers(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching members for board ${id}:`, error);
    throw error;
  }
};

/**
 * Récupérer les labels d'un board
 * @param {string} id - ID du board
 */
export const getBoardLabels = async (id) => {
  try {
    const response = await trelloClient.get(BOARDS_ENDPOINTS.getLabels(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching labels for board ${id}:`, error);
    throw error;
  }
};
