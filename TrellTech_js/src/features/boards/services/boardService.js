// import trelloClient from '../../../api/trello/client';

// /**
//  * Service pour gérer les boards
//  */
// const boardService = {
//   /**
//    * Récupérer tous les boards de l'utilisateur
//    */
//   getBoards: async () => {
//     try {
//       const response = await trelloClient.get('/members/me/boards', {
//         params: {
//           fields: 'id,name,desc,closed,url,prefs',
//           filter: 'open',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error retrieving boards:', error);
//       throw error;
//     }
//   },

//   /**
//    * Récupérer un board par son ID
//    */
//   getBoardById: async (boardId) => {
//     try {
//       const response = await trelloClient.get(`/boards/${boardId}`, {
//         params: {
//           fields: 'all',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error retrieving board:', error);
//       throw error;
//     }
//   },

//   /**
//    * R�cup�rer les listes d'un board
//    */
//   getBoardLists: async (boardId) => {
//     try {
//       const response = await trelloClient.get(`/boards/${boardId}/lists`, {
//         params: {
//           fields: 'id,name,closed,pos',
//           filter: 'open',
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error retrieving board lists:', error);
//       throw error;
//     }
//   },

//   /**
//    * Créer un nouveau board
//    */
//   createBoard: async (name, desc = '', idOrganization = null) => {
//     try {
//       const payload = new URLSearchParams();
//       payload.append('name', name);
//       if (desc) payload.append('desc', desc);
//       if (idOrganization) payload.append('idOrganization', idOrganization);
      
//       payload.append('defaultLists', 'false');

//       const response = await trelloClient.post('/boards', payload.toString(), {
//         headers: { 
//           'Content-Type': 'application/x-www-form-urlencoded' 
//         },
//       });
      
//       console.log(' Board créé avec succès:', response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating board:', error);
//       console.error('Détails de l\'erreur:', error.response?.data);
//       throw error;
//     }
//   },
//   /**
//    * Mettre à jour un board
//    */
//   updateBoard: async (boardId, updates) => {
//     try {
//       const response = await trelloClient.put(`/boards/${boardId}`, null, {
//         params: updates,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating board:', error);
//       throw error;
//     }
//   },

//   /**
//    * Supprimer un board
//    */
//   deleteBoard: async (boardId) => {
//     try {
//       await trelloClient.delete(`/boards/${boardId}`);
//     } catch (error) {
//       console.error('Error deleting board:', error);
//       throw error;
//     }
//   },

//   /**
//    * Archiver un board
//    */
//   archiveBoard: async (boardId) => {
//     try {
//       const response = await trelloClient.put(`/boards/${boardId}`, null, {
//         params: { closed: true },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error archiving board:', error);
//       throw error;
//     }
//   },
// };

// export default boardService;


// boardService.js - CORRECTION AVEC TEMPLATES
import trelloClient from '../../../api/trello/client';

const boardService = {
  /**
   * Récupérer tous les boards de l'utilisateur
   */
  getBoards: async () => {
    try {
      const response = await trelloClient.get('/members/me/boards', {
        params: {
          fields: 'id,name,desc,closed,url,prefs,idOrganization',
          filter: 'open',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving boards:', error);
      throw error;
    }
  },

  /**
   * Récupérer un board par son ID
   */
  getBoardById: async (boardId) => {
    try {
      const response = await trelloClient.get(`/boards/${boardId}`, {
        params: {
          fields: 'id,name,desc,closed,idOrganization,prefs',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving board:', error);
      throw error;
    }
  },

  /**
   * Récupérer les listes d'un board
   */
  getBoardLists: async (boardId) => {
    try {
      const response = await trelloClient.get(`/boards/${boardId}/lists`, {
        params: {
          fields: 'id,name,closed,pos',
          filter: 'open',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error retrieving board lists:', error);
      throw error;
    }
  },

  /**
   * Créer un nouveau board avec template
   */
  createBoard: async (name, desc = '', idOrganization = null, template = 'kanban') => {
    try {
      const payload = new URLSearchParams();
      payload.append('name', name);
      if (desc) payload.append('desc', desc);
      if (idOrganization) payload.append('idOrganization', idOrganization);
      
      // Configuration basée sur le template
      switch (template) {
        case 'kanban':
          payload.append('defaultLists', 'true'); // To Do, Doing, Done
          break;
        case 'scrum':
          payload.append('defaultLists', 'true'); // Backlog, Sprint Backlog, In Progress, Done
          break;
        case 'project':
          payload.append('defaultLists', 'false'); // Aucune liste par défaut
          break;
        default:
          payload.append('defaultLists', 'true');
      }

      const response = await trelloClient.post('/boards', payload.toString(), {
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
      });
      
      console.log('✅ Board créé avec succès (template:', template, '):', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating board:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      throw error;
    }
  },

  /**
   * Mettre à jour un board
   */
  updateBoard: async (boardId, updates) => {
    try {
      const payload = new URLSearchParams();
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined && updates[key] !== null) {
          payload.append(key, updates[key]);
        }
      });

      const response = await trelloClient.put(
        `/boards/${boardId}`,
        payload.toString(),
        { 
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  },

  /**
   * Supprimer un board
   */
  deleteBoard: async (boardId) => {
    try {
      await trelloClient.delete(`/boards/${boardId}`);
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  },

  /**
   * Archiver un board
   */
  archiveBoard: async (boardId) => {
    try {
      const payload = new URLSearchParams();
      payload.append('closed', 'true');

      const response = await trelloClient.put(
        `/boards/${boardId}`,
        payload.toString(),
        { 
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' } 
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error archiving board:', error);
      throw error;
    }
  },
};

export default boardService;