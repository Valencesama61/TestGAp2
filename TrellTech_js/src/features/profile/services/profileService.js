import trelloClient from '../../../api/trello/client';
import { MEMBERS_ENDPOINTS } from '../../../api/trello/endpoints';

/**
 * Service pour gérer les opérations liées au profil utilisateur
 */
const profileService = {
  /**
   * Récupère les informations du profil de l'utilisateur connecté
   * @returns {Promise<Object>} Les données du profil
   */
  async getMyProfile() {
    try {
      const response = await trelloClient.get(MEMBERS_ENDPOINTS.getMe, {
        params: {
          fields: 'fullName,username,email,bio,url,avatarUrl,initials,memberType,products',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  /**
   * Récupère les informations d'un membre spécifique
   * @param {string} memberId - ID du membre
   * @returns {Promise<Object>} Les données du membre
   */
  async getMemberById(memberId) {
    try {
      const response = await trelloClient.get(
        MEMBERS_ENDPOINTS.getMember(memberId),
        {
          params: {
            fields: 'fullName,username,bio,url,avatarUrl,initials',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du membre:', error);
      throw error;
    }
  },

  /**
   * Met à jour les informations du profil
   * @param {Object} updates - Les champs à mettre à jour
   * @param {string} [updates.fullName] - Nom complet
   * @param {string} [updates.bio] - Biographie
   * @param {string} [updates.initials] - Initiales
   * @returns {Promise<Object>} Les données mises à jour
   */
  async updateProfile(updates) {
    try {
      const payload = new URLSearchParams();
      
      if (updates.fullName) payload.append('fullName', updates.fullName);
      if (updates.bio) payload.append('bio', updates.bio);
      if (updates.initials) payload.append('initials', updates.initials);

      const response = await trelloClient.put(
        MEMBERS_ENDPOINTS.getMe,
        payload.toString(),
        {
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded' 
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      throw error;
    }
  },

  /**
   * Récupère les boards de l'utilisateur
   * @returns {Promise<Array>} Liste des boards
   */
  async getMyBoards() {
    try {
      const response = await trelloClient.get(MEMBERS_ENDPOINTS.getMyBoards, {
        params: {
          fields: 'name,desc,closed,url,prefs',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des boards:', error);
      throw error;
    }
  },

  /**
   * Récupère les organisations de l'utilisateur
   * @returns {Promise<Array>} Liste des organisations
   */
  async getMyOrganizations() {
    try {
      const response = await trelloClient.get(
        MEMBERS_ENDPOINTS.getMyOrganizations,
        {
          params: {
            fields: 'displayName,desc,url,website',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des organisations:', error);
      throw error;
    }
  },

  /**
   * Récupère les cartes assignées à l'utilisateur
   * @returns {Promise<Array>} Liste des cartes
   */
  async getMyCards() {
    try {
      const response = await trelloClient.get(MEMBERS_ENDPOINTS.getMyCards, {
        params: {
          fields: 'name,desc,due,dueComplete,idBoard,idList',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes:', error);
      throw error;
    }
  },

  /**
   * Récupère les notifications de l'utilisateur
   * @param {number} limit - Nombre de notifications à récupérer
   * @returns {Promise<Array>} Liste des notifications
   */
  async getMyNotifications(limit = 20) {
    try {
      const response = await trelloClient.get(
        MEMBERS_ENDPOINTS.getMyNotifications,
        {
          params: {
            limit,
            readFilter: 'all',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  },

  /**
   * Met à jour l'avatar de l'utilisateur
   * @param {string} avatarSource - Source de l'avatar (upload ou gravatar)
   * @param {File} [file] - Fichier image (pour upload)
   * @returns {Promise<Object>} Les données mises à jour
   */
  async updateAvatar(avatarSource, file) {
    try {
      const formData = new FormData();
      if (avatarSource === 'upload' && file) {
        formData.append('file', file);
      }
      formData.append('avatarSource', avatarSource);

      const response = await trelloClient.post(
        `${MEMBERS_ENDPOINTS.updateMe}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
      throw error;
    }
  },

  /**
   * Marque une notification comme lue
   * @param {string} notificationId - ID de la notification
   * @returns {Promise<Object>} La notification mise à jour
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await trelloClient.put(
        `/notifications/${notificationId}`,
        null,
        {
          params: {
            unread: false,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erreur lors du marquage de la notification comme lue:',
        error
      );
      throw error;
    }
  },

  /**
   * Marque toutes les notifications comme lues
   * @returns {Promise<void>}
   */
  async markAllNotificationsAsRead() {
    try {
      await trelloClient.post(
        `${MEMBERS_ENDPOINTS.getMe}/notificationsRead`,
        null
      );
    } catch (error) {
      console.error(
        'Erreur lors du marquage de toutes les notifications comme lues:',
        error
      );
      throw error;
    }
  },
};

export default profileService;
