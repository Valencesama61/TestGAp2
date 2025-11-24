/**
 * =========================================
 * INTEGRATION TESTS: LIST SERVICE
 * =========================================
 *
 * These tests verify CRUD operations for Trello lists (columns).
 *
 * TEST COVERAGE:
 * - Create list
 * - Read list (by ID, get cards)
 * - Update list (rename)
 * - Archive list
 * - Move all cards between lists
 *
 * MOCKING STRATEGY:
 * - API calls: Intercepted by MSW to return controlled responses
 * - Lists represent columns in a Kanban board (To Do, In Progress, Done)
 */

import listService from '../../features/lists/services/listService';
import { mockStore } from '../mocks/handlers';

// ============================================
// TEST SUITE: LIST SERVICE
// ============================================

describe('Integration Tests - List Service', () => {

  // ============================================
  // SETUP & TEARDOWN
  // ============================================

  /**
   * Before each test, reset mockStore to initial state
   * This ensures consistent test data across all tests
   */
  beforeEach(() => {
    // Reset lists to initial state
    mockStore.lists = [
      {
        id: "list1",
        name: "To Do",
        closed: false,
        idBoard: "board1",
        pos: 1
      },
      {
        id: "list2",
        name: "In Progress",
        closed: false,
        idBoard: "board1",
        pos: 2
      },
      {
        id: "list3",
        name: "Done",
        closed: false,
        idBoard: "board1",
        pos: 3
      }
    ];

    // Reset cards for list operations
    mockStore.cards = [
      {
        id: "card1",
        name: "Test Card 1",
        desc: "Card description",
        idList: "list1",
        idBoard: "board1"
      },
      {
        id: "card2",
        name: "Test Card 2",
        desc: "Another card",
        idList: "list1",
        idBoard: "board1"
      }
    ];
  });

  // ============================================
  // TEST GROUP: CREATE LIST
  // ============================================

  describe('Create List', () => {

    /**
     * TEST: Create a new list (column) on a board
     *
     * SCENARIO:
     * User creates a new column on their Kanban board
     * (e.g., adding "Review" between "In Progress" and "Done")
     *
     * ASSERTION: Verify list is created with correct properties
     *
     * API ENDPOINT: POST /lists
     * REQUEST BODY: name, idBoard, pos (URLSearchParams)
     */
    test('should create a new list on a board', async () => {
      const boardId = "board1";
      const listName = "Review";

      // Execute: Create list (MSW intercepts and returns mock response)
      const newList = await listService.createList(boardId, listName);

      // Verify: List was created successfully
      expect(newList).toBeDefined();
      expect(newList.id).toBeDefined(); // Auto-generated ID
      expect(newList.name).toBe(listName);
      expect(newList.idBoard).toBe(boardId);
      expect(newList.closed).toBe(false);
      expect(newList.pos).toBeDefined(); // Position in board

      // Verify: List was added to mock store
      expect(mockStore.lists.some(l => l.name === listName)).toBe(true);
    });

    /**
     * TEST: Create multiple lists sequentially
     *
     * SCENARIO:
     * User sets up a new board by creating several columns
     * (To Do, In Progress, Testing, Review, Done)
     *
     * ASSERTION: Verify all lists are created in sequence
     */
    test('should create multiple lists for workflow stages', async () => {
      const boardId = "board2";
      const initialListCount = mockStore.lists.length;

      // Create workflow columns
      const lists = [
        "Backlog",
        "Selected for Development",
        "In Development",
        "Code Review",
        "Testing",
        "Deployed"
      ];

      // Execute: Create all lists
      for (const listName of lists) {
        const newList = await listService.createList(boardId, listName);
        expect(newList.name).toBe(listName);
        expect(newList.idBoard).toBe(boardId);
      }

      // Verify: All lists were created
      expect(mockStore.lists.length).toBe(initialListCount + lists.length);
    });

    /**
     * TEST: Create list with position specified
     *
     * SCENARIO:
     * User creates a list at a specific position
     *
     * ASSERTION: Verify position is set correctly
     *
     * NOTE: Position can be "top", "bottom", or a number
     */
    test('should create list at bottom position', async () => {
      const boardId = "board1";
      const listName = "Archive";

      // Execute: Create list (defaults to bottom position)
      const newList = await listService.createList(boardId, listName);

      // Verify: List created with position
      expect(newList).toBeDefined();
      expect(newList.name).toBe(listName);
      expect(newList.pos).toBeDefined();
      // Note: MSW sets pos to 1000 by default
    });
  });

  // ============================================
  // TEST GROUP: READ LISTS
  // ============================================

  describe('Read Lists', () => {

    /**
     * TEST: Get specific list by ID
     *
     * SCENARIO:
     * User needs details about a specific list/column
     *
     * ASSERTION: Verify correct list is returned
     *
     * API ENDPOINT: GET /lists/:listId
     * QUERY PARAMS: fields
     */
    test('should retrieve a specific list by ID', async () => {
      const listId = "list1";

      // Execute: Get list by ID
      const list = await listService.getListById(listId);

      // Verify: Correct list returned
      expect(list).toBeDefined();
      expect(list.id).toBe(listId);
      expect(list.name).toBe("To Do");
      expect(list.idBoard).toBe("board1");
      expect(list.closed).toBe(false);
    });

    /**
     * TEST: Get list that doesn't exist
     *
     * SCENARIO:
     * User tries to access a list that was deleted
     *
     * ASSERTION: Verify 404 error is thrown
     */
    test('should throw error when list is not found', async () => {
      const nonExistentListId = "list_does_not_exist";

      // Execute & Verify: Error is thrown
      await expect(
        listService.getListById(nonExistentListId)
      ).rejects.toThrow();
    });

    /**
     * TEST: Get all cards from a list
     *
     * SCENARIO:
     * User views a list and needs to see all cards in it
     *
     * ASSERTION: Verify cards are returned for the list
     *
     * API ENDPOINT: GET /lists/:listId/cards
     * QUERY PARAMS: fields
     */
    test('should retrieve all cards from a list', async () => {
      const listId = "list1";

      // Execute: Get cards from list
      const cards = await listService.getListCards(listId);

      // Verify: Cards returned
      expect(cards).toBeDefined();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBeGreaterThan(0);

      // Verify: All cards belong to the list
      cards.forEach(card => {
        expect(card.idList).toBe(listId);
        expect(card.id).toBeDefined();
        expect(card.name).toBeDefined();
      });
    });

    /**
     * TEST: Get cards from empty list
     *
     * SCENARIO:
     * User views a newly created list with no cards
     *
     * ASSERTION: Verify empty array is returned
     */
    test('should return empty array for list with no cards', async () => {
      const listId = "list2"; // List with no cards

      // Execute: Get cards from empty list
      const cards = await listService.getListCards(listId);

      // Verify: Empty array returned
      expect(cards).toBeDefined();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });
  });

  // ============================================
  // TEST GROUP: UPDATE LIST
  // ============================================

  describe('Update List', () => {

    /**
     * TEST: Update list name (rename column)
     *
     * SCENARIO:
     * User renames a list/column
     * (e.g., "To Do" → "Backlog", "Done" → "Completed")
     *
     * ASSERTION: Verify list name is updated
     *
     * API ENDPOINT: PUT /lists/:listId
     * REQUEST BODY: name (URLSearchParams)
     */
    test('should update list name', async () => {
      const listId = "list1";
      const newName = "Backlog";

      // Verify: Original name
      const listBefore = mockStore.lists.find(l => l.id === listId);
      expect(listBefore.name).toBe("To Do");

      // Execute: Update list name
      const updatedList = await listService.updateList(listId, newName);

      // Verify: Name was updated
      expect(updatedList).toBeDefined();
      expect(updatedList.id).toBe(listId);
      expect(updatedList.name).toBe(newName);

      // Verify: Change persisted in mock store
      const listAfter = mockStore.lists.find(l => l.id === listId);
      expect(listAfter.name).toBe(newName);
    });

    /**
     * TEST: Rename multiple lists
     *
     * SCENARIO:
     * User customizes their workflow by renaming all columns
     *
     * ASSERTION: Verify multiple lists can be renamed
     */
    test('should rename multiple lists independently', async () => {
      // Rename all lists
      await listService.updateList("list1", "Planning");
      await listService.updateList("list2", "Development");
      await listService.updateList("list3", "Completed");

      // Verify: All lists renamed
      expect(mockStore.lists.find(l => l.id === "list1").name).toBe("Planning");
      expect(mockStore.lists.find(l => l.id === "list2").name).toBe("Development");
      expect(mockStore.lists.find(l => l.id === "list3").name).toBe("Completed");
    });

    /**
     * TEST: Update non-existent list
     *
     * SCENARIO:
     * User tries to update a list that doesn't exist
     *
     * ASSERTION: Verify error is thrown
     */
    test('should throw error when updating non-existent list', async () => {
      const nonExistentListId = "list_fake_id";

      // Execute & Verify: Error is thrown
      await expect(
        listService.updateList(nonExistentListId, "New Name")
      ).rejects.toThrow();
    });
  });

  // ============================================
  // TEST GROUP: ARCHIVE LIST
  // ============================================

  describe('Archive List', () => {

    /**
     * TEST: Archive a list (soft delete)
     *
     * SCENARIO:
     * User archives a list (sets closed=true)
     * List is hidden but not permanently deleted
     * Usually done when a workflow stage is no longer needed
     *
     * ASSERTION: Verify list is marked as closed
     *
     * API ENDPOINT: PUT /lists/:listId/closed
     * REQUEST BODY: value=true (URLSearchParams)
     */
    test('should archive a list by setting closed to true', async () => {
      const listId = "list3";

      // Verify: List is open before archiving
      const listBefore = mockStore.lists.find(l => l.id === listId);
      expect(listBefore.closed).toBe(false);

      // Execute: Archive list
      const archivedList = await listService.archiveList(listId);

      // Verify: List is now closed
      expect(archivedList).toBeDefined();
      expect(archivedList.closed).toBe(true);

      // Verify: Change persisted in mock store
      const listAfter = mockStore.lists.find(l => l.id === listId);
      expect(listAfter.closed).toBe(true);
    });

    /**
     * TEST: Archive list with cards
     *
     * SCENARIO:
     * User archives a list that still contains cards
     * Cards remain with the list (also archived)
     *
     * ASSERTION: Verify list can be archived even with cards
     */
    test('should archive list that contains cards', async () => {
      const listId = "list1"; // Has 2 cards

      // Verify: List has cards
      const cardsInList = mockStore.cards.filter(c => c.idList === listId);
      expect(cardsInList.length).toBeGreaterThan(0);

      // Execute: Archive list
      const archivedList = await listService.archiveList(listId);

      // Verify: List is archived
      expect(archivedList.closed).toBe(true);

      // Note: Cards remain in the list, they are also effectively archived
      const cardsStillInList = mockStore.cards.filter(c => c.idList === listId);
      expect(cardsStillInList.length).toBe(cardsInList.length);
    });

    /**
     * TEST: Archive non-existent list
     *
     * SCENARIO:
     * User tries to archive a list that doesn't exist
     *
     * ASSERTION: Verify error is thrown
     */
    test('should throw error when archiving non-existent list', async () => {
      const nonExistentListId = "list_archive_fake";

      // Execute & Verify: Error is thrown
      await expect(
        listService.archiveList(nonExistentListId)
      ).rejects.toThrow();
    });
  });

  // ============================================
  // TEST GROUP: MOVE ALL CARDS
  // ============================================

  describe('Move All Cards Between Lists', () => {

    /**
     * TEST: Move all cards from one list to another
     *
     * SCENARIO:
     * User wants to bulk-move all cards from one column to another
     * (e.g., moving all "To Do" cards to "In Progress" at sprint start)
     *
     * ASSERTION: Verify all cards are moved to target list
     *
     * API ENDPOINT: POST /lists/:listId/moveAllCards
     * REQUEST BODY: idBoard, idList (URLSearchParams)
     */
    test('should move all cards from source list to target list', async () => {
      const sourceListId = "list1";
      const targetListId = "list2";
      const boardId = "board1";

      // Verify: Source list has cards, target list is empty
      const cardsInSource = mockStore.cards.filter(c => c.idList === sourceListId);
      const cardsInTargetBefore = mockStore.cards.filter(c => c.idList === targetListId);

      expect(cardsInSource.length).toBeGreaterThan(0);
      expect(cardsInTargetBefore.length).toBe(0);

      // Execute: Move all cards
      await listService.moveAllCards(sourceListId, targetListId, boardId);

      // Verify: All cards moved to target list
      const cardsInSourceAfter = mockStore.cards.filter(c => c.idList === sourceListId);
      const cardsInTargetAfter = mockStore.cards.filter(c => c.idList === targetListId);

      expect(cardsInSourceAfter.length).toBe(0); // Source now empty
      expect(cardsInTargetAfter.length).toBe(cardsInSource.length); // Target has all cards
    });

    /**
     * TEST: Move cards from empty list
     *
     * SCENARIO:
     * User tries to move cards from a list that has no cards
     *
     * ASSERTION: Verify operation completes without error
     */
    test('should handle moving cards from empty list gracefully', async () => {
      const emptyListId = "list2";
      const targetListId = "list3";
      const boardId = "board1";

      // Verify: Source list is empty
      const cardsInSource = mockStore.cards.filter(c => c.idList === emptyListId);
      expect(cardsInSource.length).toBe(0);

      // Execute: Try to move cards from empty list
      await listService.moveAllCards(emptyListId, targetListId, boardId);

      // Verify: No error thrown, target list unchanged
      const cardsInTarget = mockStore.cards.filter(c => c.idList === targetListId);
      expect(cardsInTarget.length).toBe(0); // Still empty
    });

    /**
     * TEST: Bulk move workflow (cleanup sprint)
     *
     * SCENARIO:
     * At end of sprint, move all completed cards to archive
     *
     * ASSERTION: Verify bulk operation works for workflow cleanup
     */
    test('should support bulk card movement for workflow cleanup', async () => {
      const doneListId = "list3";
      const boardId = "board1";

      // Create an archive list
      const archiveList = await listService.createList(boardId, "Archive");
      const archiveListId = archiveList.id;

      // Move some cards to "Done"
      mockStore.cards[0].idList = doneListId;
      mockStore.cards[1].idList = doneListId;

      // Verify: Cards in "Done" list
      const cardsInDone = mockStore.cards.filter(c => c.idList === doneListId);
      expect(cardsInDone.length).toBe(2);

      // Execute: Move all done cards to archive
      await listService.moveAllCards(doneListId, archiveListId, boardId);

      // Verify: Cards moved to archive
      const cardsInArchive = mockStore.cards.filter(c => c.idList === archiveListId);
      expect(cardsInArchive.length).toBe(2);

      // Verify: "Done" list is now empty
      const cardsInDoneAfter = mockStore.cards.filter(c => c.idList === doneListId);
      expect(cardsInDoneAfter.length).toBe(0);
    });
  });

  // ============================================
  // TEST GROUP: COMPLETE WORKFLOWS
  // ============================================

  describe('Complete List Workflows', () => {

    /**
     * TEST: Complete list lifecycle
     *
     * SCENARIO:
     * 1. Create list
     * 2. Rename list
     * 3. Add cards to list (via card service - simulated)
     * 4. Move all cards to another list
     * 5. Archive list
     *
     * ASSERTION: Verify entire lifecycle works correctly
     */
    test('should handle complete list lifecycle', async () => {
      const boardId = "board1";

      // Step 1: Create list
      const newList = await listService.createList(boardId, "Sprint 1");
      const listId = newList.id;

      expect(newList).toBeDefined();
      expect(newList.name).toBe("Sprint 1");

      // Step 2: Rename list
      const renamedList = await listService.updateList(listId, "Sprint 1 - Active");
      expect(renamedList.name).toBe("Sprint 1 - Active");

      // Step 3: Simulate cards being added to list
      mockStore.cards.push({
        id: "card_sprint_1",
        name: "Sprint Task",
        idList: listId,
        idBoard: boardId
      });

      // Verify: Card in list
      const cardsInList = mockStore.cards.filter(c => c.idList === listId);
      expect(cardsInList.length).toBe(1);

      // Step 4: Move all cards to another list
      await listService.moveAllCards(listId, "list3", boardId);

      // Verify: Cards moved
      const cardsInListAfter = mockStore.cards.filter(c => c.idList === listId);
      expect(cardsInListAfter.length).toBe(0);

      // Step 5: Archive list
      const archivedList = await listService.archiveList(listId);
      expect(archivedList.closed).toBe(true);
    });

    /**
     * TEST: Setup new board with standard workflow
     *
     * SCENARIO:
     * User creates a new board and sets up standard Kanban columns
     *
     * ASSERTION: Verify board setup workflow
     */
    test('should setup standard Kanban workflow on new board', async () => {
      const boardId = "board_new";
      const initialListCount = mockStore.lists.length;

      // Create standard Kanban columns
      const columns = [
        "📋 Backlog",
        "📝 To Do",
        "🔄 In Progress",
        "👀 Review",
        "✅ Done"
      ];

      // Execute: Create all columns
      const createdLists = [];
      for (const columnName of columns) {
        const list = await listService.createList(boardId, columnName);
        createdLists.push(list);
      }

      // Verify: All columns created
      expect(mockStore.lists.length).toBe(initialListCount + columns.length);

      // Verify: All lists belong to the board
      createdLists.forEach(list => {
        expect(list.idBoard).toBe(boardId);
        expect(list.closed).toBe(false);
      });
    });

    /**
     * TEST: Reorganize workflow stages
     *
     * SCENARIO:
     * User decides to reorganize their workflow
     * by renaming and archiving old lists
     *
     * ASSERTION: Verify workflow reorganization
     */
    test('should support workflow reorganization', async () => {
      // Rename existing lists
      await listService.updateList("list1", "📥 Inbox");
      await listService.updateList("list2", "🚀 Doing");
      await listService.updateList("list3", "✨ Complete");

      // Verify: All lists renamed
      expect(mockStore.lists.find(l => l.id === "list1").name).toBe("📥 Inbox");
      expect(mockStore.lists.find(l => l.id === "list2").name).toBe("🚀 Doing");
      expect(mockStore.lists.find(l => l.id === "list3").name).toBe("✨ Complete");

      // Create new intermediate stage
      const reviewList = await listService.createList("board1", "👁 Review");
      expect(reviewList).toBeDefined();
      expect(reviewList.name).toBe("👁 Review");
    });
  });

  // ============================================
  // TEST GROUP: ERROR HANDLING
  // ============================================

  describe('Error Handling', () => {

    /**
     * TEST: Handle API errors appropriately
     *
     * SCENARIO:
     * Various error conditions during list operations
     *
     * ASSERTION: Verify errors are properly thrown
     */
    test('should handle errors when operating on non-existent lists', async () => {
      const fakeListId = "list_error_test";

      // Test various operations on non-existent list
      await expect(listService.getListById(fakeListId)).rejects.toThrow();
      await expect(listService.updateList(fakeListId, "Name")).rejects.toThrow();
      await expect(listService.archiveList(fakeListId)).rejects.toThrow();
    });

    /**
     * TEST: Handle invalid parameters
     *
     * SCENARIO:
     * User provides invalid data
     *
     * ASSERTION: Verify appropriate handling
     */
    test('should handle invalid board ID when creating list', async () => {
      // In real scenario, invalid board ID would cause error
      // This is conceptual test showing expected behavior
      const invalidBoardId = "board_does_not_exist";
      const listName = "Test List";

      // Execute: Try to create list on non-existent board
      // In real implementation, this might succeed in mock but fail in production
      const result = await listService.createList(invalidBoardId, listName);

      // Verify: List is created (mock doesn't validate board existence)
      expect(result).toBeDefined();
      expect(result.idBoard).toBe(invalidBoardId);
    });
  });
});
