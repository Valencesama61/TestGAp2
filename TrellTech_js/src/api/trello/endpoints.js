/**
 * WORKSPACES (Organizations dans Trello)
 * Les workspaces permettent de regrouper des boards
 */
/* export const WORKSPACES_ENDPOINTS = {

  getAll: '/members/me/organizations',
  
  getById: (id) => `/organizations/${id}`,
  
  create: '/organizations',
  
  update: (id) => `/organizations/${id}`,
  
  delete: (id) => `/organizations/${id}`,
  
  getBoards: (id) => `/organizations/${id}/boards`,
  
  getMembers: (id) => `/organizations/${id}/members`,
}; */

export const trelloEndpoints = {
  workspaces: {
    getMine: "/members/me/organizations",
    create: "/organizations",
    update: (id) => `/organizations/${id}`,
    delete: (id) => `/organizations/${id}`,
  },
};


/**
 * BOARDS
 * Les boards contiennent des listes de cartes
 */
export const BOARDS_ENDPOINTS = {

  getAll: '/members/me/boards',

  getById: (id) => `/boards/${id}`,

  create: '/boards',
  
  update: (id) => `/boards/${id}`,
  
  delete: (id) => `/boards/${id}`,
  
  getLists: (id) => `/boards/${id}/lists`,
  
  getMembers: (id) => `/boards/${id}/members`,
  
  getCards: (id) => `/boards/${id}/cards`,
  
  getLabels: (id) => `/boards/${id}/labels`,
};

/**
 * LISTS
 * Les listes contiennent des cartes (ex: To Do, In Progress, Done)
 */
export const LISTS_ENDPOINTS = {
  getById: (id) => `/lists/${id}`,
  
  create: '/lists',
  
  update: (id) => `/lists/${id}`,
  
  archive: (id) => `/lists/${id}/closed`,
  
  getCards: (id) => `/lists/${id}/cards`,
  
  moveAllCards: (id) => `/lists/${id}/moveAllCards`,
};

/**
 * CARDS
 * Les cartes sont les tâches individuelles
 */
export const CARDS_ENDPOINTS = {

  getById: (id) => `/cards/${id}`,
  
  // Paramètres requis: name, idList
  create: '/cards',
  
  // Peut modifier: name, desc, idList, pos, due, dueComplete, etc.
  update: (id) => `/cards/${id}`,
  
  delete: (id) => `/cards/${id}`,
  
  // Paramètre requis: value (memberId)
  addMember: (id) => `/cards/${id}/idMembers`,
  
  removeMember: (cardId, memberId) => `/cards/${cardId}/idMembers/${memberId}`,
  
  // Récupérer tous les membres assignés à une carte
  getMembers: (id) => `/cards/${id}/members`,
  
  // Ajouter un label à une carte
  addLabel: (id) => `/cards/${id}/idLabels`,
  
  // Retirer un label d'une carte
  removeLabel: (cardId, labelId) => `/cards/${cardId}/idLabels/${labelId}`,
  
  // Récupérer les commentaires (actions) d'une carte
  getComments: (id) => `/cards/${id}/actions`,
  
  addComment: (id) => `/cards/${id}/actions/comments`,
  
  getChecklists: (id) => `/cards/${id}/checklists`,
  
  addChecklist: (id) => `/cards/${id}/checklists`,
  
  // Récupérer les pièces jointes d'une carte
  getAttachments: (id) => `/cards/${id}/attachments`,
  
  // Ajouter une pièce jointe
  addAttachment: (id) => `/cards/${id}/attachments`,
};

/**
 * MEMBERS
 * Informations sur les utilisateurs Trello
 */
export const MEMBERS_ENDPOINTS = {
  getMe: '/members/me',
  
  getById: (id) => `/members/${id}`,
  
  getBoards: (id) => `/members/${id}/boards`,
  
  getOrganizations: (id) => `/members/${id}/organizations`,
  
  getCards: (id) => `/members/${id}/cards`,
};

/**
 * LABELS
 * Les labels permettent de catégoriser les cartes
 */
export const LABELS_ENDPOINTS = {
  getById: (id) => `/labels/${id}`,
  
  create: '/labels',
  
  update: (id) => `/labels/${id}`,

  delete: (id) => `/labels/${id}`,
};

/**
 * CHECKLISTS
 * Les checklists sont des listes de sous-tâches dans une carte
 */
export const CHECKLISTS_ENDPOINTS = {
  getById: (id) => `/checklists/${id}`,

  create: '/checklists',
  
  update: (id) => `/checklists/${id}`,
  
  delete: (id) => `/checklists/${id}`,
  
  getItems: (id) => `/checklists/${id}/checkItems`,
  
  addItem: (id) => `/checklists/${id}/checkItems`,
  
  updateItem: (checklistId, itemId) => `/checklists/${checklistId}/checkItems/${itemId}`,
  
  deleteItem: (checklistId, itemId) => `/checklists/${checklistId}/checkItems/${itemId}`,
};

/**
 * ACTIONS
 * Les actions représentent l'historique des modifications
 */
export const ACTIONS_ENDPOINTS = {
  getById: (id) => `/actions/${id}`,
  
  update: (id) => `/actions/${id}`,
  
  delete: (id) => `/actions/${id}`,
};

/**
 * SEARCH
 * Recherche globale dans Trello
 */
export const SEARCH_ENDPOINTS = {
  // Rechercher dans tous les éléments
  search: '/search',
  
  // Rechercher uniquement des cartes
  searchCards: '/search/cards',
  
  // Rechercher uniquement des membres
  searchMembers: '/search/members',
};

/**
 * NOTIFICATIONS
 * Gérer les notifications de l'utilisateur
 */
export const NOTIFICATIONS_ENDPOINTS = {
  getAll: '/members/me/notifications',
  
  getById: (id) => `/notifications/${id}`,
  
  markAsRead: (id) => `/notifications/${id}`,
  
  markAllAsRead: '/notifications/all/read',
};

/**
 * CUSTOM FIELDS 
 * Ajouter des données custom aux cartes
 */
export const CUSTOM_FIELDS_ENDPOINTS = {
  // Récupérer les champs personnalisés d'un board
  getByBoard: (boardId) => `/boards/${boardId}/customFields`,
  
  // Créer un champ personnalisé
  create: '/customFields',
  
  // Mettre à jour un champ personnalisé
  update: (id) => `/customFields/${id}`,
  
  // Supprimer un champ personnalisé
  delete: (id) => `/customFields/${id}`,
};

// ============================================
// HELPERS - Fonctions utilitaires
// ============================================

/**
 * Construire une URL complète avec des query params
 * @param {string} endpoint - L'endpoint de base
 * @param {Object} params - Les paramètres de requête
 * @returns {string} URL complète
 */
export const buildUrl = (endpoint, params = {}) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `${endpoint}?${queryString}` : endpoint;
};

/**
 * Paramètres communs pour récupérer des détails complets
 */
export const COMMON_PARAMS = {
  // Pour les cartes
  cardDetails: {
    fields: 'all',
    members: true,
    member_fields: 'fullName,username,avatarUrl',
    labels: true,
    attachments: true,
    checklists: 'all',
  },
  
  // Pour les boards
  boardDetails: {
    fields: 'all',
    lists: 'open',
    members: 'all',
    labels: 'all',
  },
  
  // Pour les listes
  listDetails: {
    fields: 'all',
    cards: 'open',
  },
};

// Export par défaut de tous les endpoints
export default {
  WORKSPACES_ENDPOINTS,
  BOARDS_ENDPOINTS,
  LISTS_ENDPOINTS,
  CARDS_ENDPOINTS,
  MEMBERS_ENDPOINTS,
  LABELS_ENDPOINTS,
  CHECKLISTS_ENDPOINTS,
  ACTIONS_ENDPOINTS,
  SEARCH_ENDPOINTS,
  NOTIFICATIONS_ENDPOINTS,
  CUSTOM_FIELDS_ENDPOINTS,
};