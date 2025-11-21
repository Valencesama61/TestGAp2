/**
 * Test pour vérifier que tous les exports fonctionnent correctement
 * Ce fichier vérifie que la structure d'import est correcte
 */

describe('Feature exports', () => {
  describe('Lists exports', () => {
    it('should export all list hooks from index', () => {
      const hooks = require('../lists/hooks');

      expect(hooks.useCreateList).toBeDefined();
      expect(hooks.useUpdateList).toBeDefined();
      expect(hooks.useDeleteList).toBeDefined();
      expect(hooks.useArchiveList).toBeDefined();
      expect(hooks.useMoveAllCards).toBeDefined();
      expect(hooks.useLists).toBeDefined();
    });

    it('should export list service from index', () => {
      const service = require('../lists/services');

      expect(service.default).toBeDefined();
      expect(service.listService).toBeDefined();
    });
  });

  describe('Cards exports', () => {
    it('should export all card hooks from index', () => {
      const hooks = require('../cards/hooks');

      expect(hooks.useCreateCard).toBeDefined();
      expect(hooks.useUpdateCard).toBeDefined();
      expect(hooks.useDeleteCard).toBeDefined();
      expect(hooks.useMoveCard).toBeDefined();
      expect(hooks.useAssignMember).toBeDefined();
      expect(hooks.useRemoveMember).toBeDefined();
      expect(hooks.useAddLabel).toBeDefined();
      expect(hooks.useRemoveLabel).toBeDefined();
      expect(hooks.useCards).toBeDefined();
    });

    it('should export card service from index', () => {
      const service = require('../cards/services');

      expect(service.default).toBeDefined();
      expect(service.cardService).toBeDefined();
    });
  });
});
