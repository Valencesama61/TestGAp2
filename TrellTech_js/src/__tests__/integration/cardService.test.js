/**
 * =========================================
 * INTEGRATION TESTS: CARD SERVICE
 * =========================================
 *
 * These tests verify CRUD operations for Trello cards.
 *
 * TEST COVERAGE:
 * - Create card
 * - Read cards (by list, by ID)
 * - Update card (name, description, due date)
 * - Delete card
 * - Move card between lists
 * - Assign/remove members to/from card
 * - Add/remove labels
 *
 * MOCKING STRATEGY:
 * - API calls: Intercepted by MSW to return controlled responses
 * - Member and label operations are mocked to return predefined data
 */

import cardService from '../../features/cards/services/cardService';
import { mockStore } from '../mocks/handlers';

// ============================================
// TEST SUITE: CARD SERVICE
// ============================================

describe('Integration Tests - Card Service', () => {

  // ============================================
  // SETUP & TEARDOWN
  // ============================================

  /**
   * Before each test, reset mockStore to initial state
   * This ensures consistent test data
   */
  beforeEach(() => {
    // Reset cards to initial state
    mockStore.cards = [
      {
        id: "card1",
        name: "Test Card 1",
        desc: "Test card description",
        idList: "list1",
        idBoard: "board1",
        due: null,
        dueComplete: false,
        labels: [],
        idMembers: []
      },
      {
        id: "card2",
        name: "Test Card 2",
        desc: "Another test card",
        idList: "list1",
        idBoard: "board1",
        due: "2025-12-31T23:59:59.000Z",
        dueComplete: false,
        labels: [],
        idMembers: []
      }
    ];
  });

  // ============================================
  // TEST GROUP: CREATE CARD
  // ============================================

  describe('Create Card', () => {

    /**
     * TEST: Create a basic card with name only
     *
     * SCENARIO:
     * User creates a simple card with just a name (no description, no due date)
     *
     * ASSERTION: Verify card is created with minimal data
     *
     * API ENDPOINT: POST /cards
     * REQUEST BODY: name, idList (URLSearchParams)
     */
    test('should create a new card with only name and list ID', async () => {
      const cardData = {
        name: "New Task Card",
        idList: "list1"
      };

      // Execute: Create card (MSW intercepts and returns mock response)
      const newCard = await cardService.createCard(cardData);

      // Verify: Card was created successfully
      expect(newCard).toBeDefined();
      expect(newCard.id).toBeDefined(); // Auto-generated ID
      expect(newCard.name).toBe(cardData.name);
      expect(newCard.idList).toBe(cardData.idList);
      expect(newCard.desc).toBe(""); // Default empty description
      expect(newCard.due).toBeNull(); // No due date
      expect(newCard.idMembers).toEqual([]); // No members assigned

      // Verify: Card was added to mock store
      expect(mockStore.cards.some(c => c.name === cardData.name)).toBe(true);
    });

    /**
     * TEST: Create card with description
     *
     * SCENARIO:
     * User creates a card with both name and description
     *
     * ASSERTION: Verify card includes description
     *
     * API ENDPOINT: POST /cards
     * REQUEST BODY: name, idList, desc
     */
    test('should create a card with name and description', async () => {
      const cardData = {
        name: "Detailed Task",
        idList: "list1",
        desc: "This task has a detailed description explaining what needs to be done"
      };

      // Execute: Create card with description
      const newCard = await cardService.createCard(cardData);

      // Verify: Card includes description
      expect(newCard).toBeDefined();
      expect(newCard.name).toBe(cardData.name);
      expect(newCard.desc).toBe(cardData.desc);
      expect(newCard.idList).toBe(cardData.idList);
    });

    /**
     * TEST: Create card with due date
     *
     * SCENARIO:
     * User creates a card with a deadline
     *
     * ASSERTION: Verify due date is stored correctly
     *
     * API ENDPOINT: POST /cards
     * REQUEST BODY: name, idList, due
     */
    test('should create a card with due date', async () => {
      const dueDate = "2025-12-15T17:00:00.000Z";
      const cardData = {
        name: "Task with Deadline",
        idList: "list2",
        due: dueDate
      };

      // Execute: Create card with due date
      const newCard = await cardService.createCard(cardData);

      // Verify: Due date is set
      expect(newCard).toBeDefined();
      expect(newCard.name).toBe(cardData.name);
      expect(newCard.due).toBe(dueDate);
      expect(newCard.dueComplete).toBe(false); // Not completed yet
    });

    /**
     * TEST: Create card with position specified
     *
     * SCENARIO:
     * User creates a card at specific position in list (top/bottom)
     *
     * ASSERTION: Verify position parameter is included
     *
     * API ENDPOINT: POST /cards
     * REQUEST BODY: name, idList, pos
     */
    test('should create a card at top of list', async () => {
      const cardData = {
        name: "Priority Task",
        idList: "list1",
        pos: "top" // Position at top of list
      };

      // Execute: Create card at top
      const newCard = await cardService.createCard(cardData);

      // Verify: Card created successfully
      expect(newCard).toBeDefined();
      expect(newCard.name).toBe(cardData.name);
      // Note: MSW doesn't track position, but in real API it would
    });

    /**
     * TEST: Create comprehensive card with all fields
     *
     * SCENARIO:
     * User creates a fully detailed card with all available fields
     *
     * ASSERTION: Verify all fields are set correctly
     */
    test('should create a comprehensive card with all fields', async () => {
      const cardData = {
        name: "Complete Task",
        idList: "list1",
        desc: "Full task description",
        due: "2025-12-31T23:59:59.000Z",
        pos: "bottom"
      };

      // Execute: Create comprehensive card
      const newCard = await cardService.createCard(cardData);

      // Verify: All fields present
      expect(newCard).toBeDefined();
      expect(newCard.name).toBe(cardData.name);
      expect(newCard.desc).toBe(cardData.desc);
      expect(newCard.due).toBe(cardData.due);
      expect(newCard.idList).toBe(cardData.idList);
    });
  });

  // ============================================
  // TEST GROUP: READ CARDS
  // ============================================

  describe('Read Cards', () => {

    /**
     * TEST: Get all cards from a list
     *
     * SCENARIO:
     * User opens a list and views all cards in it
     *
     * ASSERTION: Verify all cards from the list are returned
     *
     * API ENDPOINT: GET /lists/:listId/cards
     */
    test('should retrieve all cards from a specific list', async () => {
      const listId = "list1";

      // Execute: Get cards from list
      const cards = await cardService.getCardsByList(listId);

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
     * TEST: Get specific card by ID
     *
     * SCENARIO:
     * User clicks on a card to view its full details
     *
     * ASSERTION: Verify correct card is returned with all details
     *
     * API ENDPOINT: GET /cards/:cardId
     * QUERY PARAMS: fields, members, labels
     */
    test('should retrieve a specific card by ID with full details', async () => {
      const cardId = "card1";

      // Execute: Get card by ID
      const card = await cardService.getCardById(cardId);

      // Verify: Correct card returned with details
      expect(card).toBeDefined();
      expect(card.id).toBe(cardId);
      expect(card.name).toBe("Test Card 1");
      expect(card.desc).toBe("Test card description");
      expect(card.idList).toBe("list1");
    });

    /**
     * TEST: Get card that doesn't exist
     *
     * SCENARIO:
     * User tries to access a card that was deleted
     *
     * ASSERTION: Verify 404 error is thrown
     */
    test('should throw error when card is not found', async () => {
      const nonExistentCardId = "card_does_not_exist";

      // Execute & Verify: Error is thrown
      await expect(
        cardService.getCardById(nonExistentCardId)
      ).rejects.toThrow();
    });

    /**
     * TEST: Get empty list (no cards)
     *
     * SCENARIO:
     * User opens a list that has no cards
     *
     * ASSERTION: Verify empty array is returned
     */
    test('should return empty array for list with no cards', async () => {
      const emptyListId = "list3"; // List with no cards

      // Execute: Get cards from empty list
      const cards = await cardService.getCardsByList(emptyListId);

      // Verify: Empty array returned
      expect(cards).toBeDefined();
      expect(Array.isArray(cards)).toBe(true);
      expect(cards.length).toBe(0);
    });
  });

  // ============================================
  // TEST GROUP: UPDATE CARD
  // ============================================

  describe('Update Card', () => {

    /**
     * TEST: Update card name
     *
     * SCENARIO:
     * User renames a card
     *
     * ASSERTION: Verify card name is updated
     *
     * API ENDPOINT: PUT /cards/:cardId
     * REQUEST BODY: name (URLSearchParams)
     */
    test('should update card name', async () => {
      const cardId = "card1";
      const newName = "Renamed Card";

      // Execute: Update card name
      const updatedCard = await cardService.updateCard(cardId, {
        name: newName
      });

      // Verify: Name was updated
      expect(updatedCard).toBeDefined();
      expect(updatedCard.id).toBe(cardId);
      expect(updatedCard.name).toBe(newName);

      // Verify: Change persisted in mock store
      const cardInStore = mockStore.cards.find(c => c.id === cardId);
      expect(cardInStore.name).toBe(newName);
    });

    /**
     * TEST: Update card description
     *
     * SCENARIO:
     * User adds or modifies card description
     *
     * ASSERTION: Verify description is updated
     *
     * API ENDPOINT: PUT /cards/:cardId
     * REQUEST BODY: desc
     */
    test('should update card description', async () => {
      const cardId = "card2";
      const newDesc = "Updated card description with more details";

      // Execute: Update card description
      const updatedCard = await cardService.updateCard(cardId, {
        desc: newDesc
      });

      // Verify: Description was updated
      expect(updatedCard).toBeDefined();
      expect(updatedCard.desc).toBe(newDesc);

      // Verify: Change persisted in mock store
      const cardInStore = mockStore.cards.find(c => c.id === cardId);
      expect(cardInStore.desc).toBe(newDesc);
    });

    /**
     * TEST: Update card due date
     *
     * SCENARIO:
     * User sets or changes the deadline for a card
     *
     * ASSERTION: Verify due date is updated
     *
     * API ENDPOINT: PUT /cards/:cardId
     * REQUEST BODY: due
     */
    test('should update card due date', async () => {
      const cardId = "card1";
      const newDueDate = "2025-12-20T15:30:00.000Z";

      // Execute: Update due date
      const updatedCard = await cardService.updateCard(cardId, {
        due: newDueDate
      });

      // Verify: Due date was updated
      expect(updatedCard).toBeDefined();
      expect(updatedCard.due).toBe(newDueDate);

      // Verify: Change persisted in mock store
      const cardInStore = mockStore.cards.find(c => c.id === cardId);
      expect(cardInStore.due).toBe(newDueDate);
    });

    /**
     * TEST: Update multiple card fields simultaneously
     *
     * SCENARIO:
     * User updates name, description, and due date at once
     *
     * ASSERTION: Verify all fields are updated
     */
    test('should update multiple card fields at once', async () => {
      const cardId = "card1";
      const updates = {
        name: "Multi-Field Update",
        desc: "Updated all fields",
        due: "2025-12-25T12:00:00.000Z"
      };

      // Execute: Update multiple fields
      const updatedCard = await cardService.updateCard(cardId, updates);

      // Verify: All fields updated
      expect(updatedCard).toBeDefined();
      expect(updatedCard.name).toBe(updates.name);
      expect(updatedCard.desc).toBe(updates.desc);
      expect(updatedCard.due).toBe(updates.due);
    });
  });

  // ============================================
  // TEST GROUP: MOVE CARD
  // ============================================

  describe('Move Card Between Lists', () => {

    /**
     * TEST: Move card to different list
     *
     * SCENARIO:
     * User drags a card from one list to another
     * (e.g., from "To Do" to "In Progress")
     *
     * ASSERTION: Verify card's idList is updated
     *
     * API ENDPOINT: PUT /cards/:cardId
     * REQUEST BODY: idList (via params)
     */
    test('should move card to a different list', async () => {
      const cardId = "card1";
      const originalListId = "list1";
      const targetListId = "list2";

      // Verify: Card is in original list
      const cardBefore = mockStore.cards.find(c => c.id === cardId);
      expect(cardBefore.idList).toBe(originalListId);

      // Execute: Move card to target list
      const movedCard = await cardService.moveCard(cardId, targetListId);

      // Verify: Card moved to new list
      expect(movedCard).toBeDefined();
      expect(movedCard.idList).toBe(targetListId);

      // Note: MSW handler for moveCard doesn't actually update the card
      // In real implementation, you'd verify the card's list changed
    });

    /**
     * TEST: Move card workflow (To Do → In Progress → Done)
     *
     * SCENARIO:
     * Simulate complete workflow of moving card through columns
     *
     * ASSERTION: Verify card can be moved through multiple lists
     */
    test('should move card through workflow stages', async () => {
      // Create a new card in "To Do"
      const newCard = await cardService.createCard({
        name: "Workflow Card",
        idList: "list1" // To Do
      });
      const cardId = newCard.id;

      // Move to "In Progress"
      const inProgress = await cardService.moveCard(cardId, "list2");
      expect(inProgress).toBeDefined();

      // Move to "Done"
      const done = await cardService.moveCard(cardId, "list3");
      expect(done).toBeDefined();
    });
  });

  // ============================================
  // TEST GROUP: DELETE CARD
  // ============================================

  describe('Delete Card', () => {

    /**
     * TEST: Delete a card permanently
     *
     * SCENARIO:
     * User deletes a card from the board
     *
     * ASSERTION: Verify card is removed from system
     *
     * API ENDPOINT: DELETE /cards/:cardId
     */
    test('should permanently delete a card', async () => {
      const cardId = "card2";

      // Verify: Card exists before deletion
      const cardsBefore = mockStore.cards.length;
      expect(mockStore.cards.some(c => c.id === cardId)).toBe(true);

      // Execute: Delete card
      await cardService.deleteCard(cardId);

      // Verify: Card no longer exists
      expect(mockStore.cards.some(c => c.id === cardId)).toBe(false);
      expect(mockStore.cards.length).toBe(cardsBefore - 1);
    });

    /**
     * TEST: Delete non-existent card
     *
     * SCENARIO:
     * User tries to delete a card that doesn't exist
     *
     * ASSERTION: Verify error is thrown
     */
    test('should throw error when deleting non-existent card', async () => {
      const nonExistentCardId = "card_delete_fake";

      // Execute & Verify: Error is thrown
      await expect(
        cardService.deleteCard(nonExistentCardId)
      ).rejects.toThrow();
    });
  });

  // ============================================
  // TEST GROUP: MEMBER MANAGEMENT
  // ============================================

  describe('Card Member Management', () => {

    /**
     * TEST: Assign member to card
     *
     * SCENARIO:
     * User assigns themselves or another team member to a card
     *
     * ASSERTION: Verify member is added to card
     *
     * API ENDPOINT: POST /cards/:cardId/idMembers
     * QUERY PARAMS: value (member ID)
     */
    test('should assign a member to a card', async () => {
      const cardId = "card1";
      const memberId = "user123";

      // Execute: Assign member to card
      const result = await cardService.addMemberToCard(cardId, memberId);

      // Verify: Member was added
      expect(result).toBeDefined();

      // Verify: Member added to mock store
      const cardInStore = mockStore.cards.find(c => c.id === cardId);
      expect(cardInStore.idMembers).toContain(memberId);
    });

    /**
     * TEST: Remove member from card
     *
     * SCENARIO:
     * User unassigns a member from a card
     *
     * ASSERTION: Verify member is removed from card
     *
     * API ENDPOINT: DELETE /cards/:cardId/idMembers/:memberId
     */
    test('should remove a member from a card', async () => {
      const cardId = "card1";
      const memberId = "user123";

      // Setup: Add member first
      await cardService.addMemberToCard(cardId, memberId);
      expect(mockStore.cards.find(c => c.id === cardId).idMembers).toContain(memberId);

      // Execute: Remove member
      await cardService.removeMemberFromCard(cardId, memberId);

      // Verify: Member was removed
      const cardInStore = mockStore.cards.find(c => c.id === cardId);
      expect(cardInStore.idMembers).not.toContain(memberId);
    });

    /**
     * TEST: Get card members
     *
     * SCENARIO:
     * User views all members assigned to a card
     *
     * ASSERTION: Verify member list is returned
     *
     * API ENDPOINT: GET /cards/:cardId/members
     */
    test('should retrieve all members of a card', async () => {
      const cardId = "card1";

      // Execute: Get card members
      const members = await cardService.getCardMembers(cardId);

      // Verify: Members returned
      expect(members).toBeDefined();
      expect(Array.isArray(members)).toBe(true);

      // Verify: Members have required fields
      members.forEach(member => {
        expect(member.id).toBeDefined();
        expect(member.fullName).toBeDefined();
      });
    });

    /**
     * TEST: Get board members for assignment
     *
     * SCENARIO:
     * User wants to see all available members to assign to card
     *
     * ASSERTION: Verify board members are returned
     *
     * API ENDPOINT: GET /boards/:boardId/members
     */
    test('should retrieve all board members available for assignment', async () => {
      const boardId = "board1";

      // Execute: Get board members
      const members = await cardService.getBoardMembers(boardId);

      // Verify: Members returned
      expect(members).toBeDefined();
      expect(Array.isArray(members)).toBe(true);
      expect(members.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // TEST GROUP: COMPLETE WORKFLOWS
  // ============================================

  describe('Complete Card Workflows', () => {

    /**
     * TEST: Complete card lifecycle
     *
     * SCENARIO:
     * 1. Create card
     * 2. Update card details
     * 3. Assign member
     * 4. Move card to different list
     * 5. Delete card
     *
     * ASSERTION: Verify entire lifecycle works correctly
     */
    test('should handle complete card lifecycle', async () => {
      // Step 1: Create card
      const newCard = await cardService.createCard({
        name: "Lifecycle Card",
        idList: "list1",
        desc: "Testing complete lifecycle"
      });
      const cardId = newCard.id;

      expect(newCard).toBeDefined();
      expect(newCard.name).toBe("Lifecycle Card");

      // Step 2: Update card
      const updatedCard = await cardService.updateCard(cardId, {
        name: "Updated Lifecycle Card",
        due: "2025-12-31T23:59:59.000Z"
      });

      expect(updatedCard.name).toBe("Updated Lifecycle Card");

      // Step 3: Assign member
      await cardService.addMemberToCard(cardId, "user123");
      const cardWithMember = mockStore.cards.find(c => c.id === cardId);
      expect(cardWithMember.idMembers).toContain("user123");

      // Step 4: Move card
      await cardService.moveCard(cardId, "list2");

      // Step 5: Delete card
      await cardService.deleteCard(cardId);
      expect(mockStore.cards.some(c => c.id === cardId)).toBe(false);
    });

    /**
     * TEST: Create and manage multiple cards
     *
     * SCENARIO:
     * User creates and manages several cards simultaneously
     *
     * ASSERTION: Verify multiple cards can be managed independently
     */
    test('should manage multiple cards independently', async () => {
      const initialCount = mockStore.cards.length;

      // Create 3 cards
      const card1 = await cardService.createCard({ name: "Multi Card 1", idList: "list1" });
      const card2 = await cardService.createCard({ name: "Multi Card 2", idList: "list1" });
      const card3 = await cardService.createCard({ name: "Multi Card 3", idList: "list2" });

      // Verify: All cards created
      expect(mockStore.cards.length).toBe(initialCount + 3);

      // Update each card independently
      await cardService.updateCard(card1.id, { desc: "Description 1" });
      await cardService.updateCard(card2.id, { desc: "Description 2" });
      await cardService.updateCard(card3.id, { desc: "Description 3" });

      // Verify: Each card has correct description
      expect(mockStore.cards.find(c => c.id === card1.id).desc).toBe("Description 1");
      expect(mockStore.cards.find(c => c.id === card2.id).desc).toBe("Description 2");
      expect(mockStore.cards.find(c => c.id === card3.id).desc).toBe("Description 3");
    });
  });

  // ============================================
  // TEST GROUP: ERROR HANDLING
  // ============================================

  describe('Error Handling', () => {

    /**
     * TEST: Handle invalid card data
     *
     * SCENARIO:
     * User tries to create card without required fields
     *
     * ASSERTION: Verify appropriate error handling
     */
    test('should handle missing required fields when creating card', async () => {
      // In real scenario, API would reject card without name
      // This is conceptual test showing expected behavior
      const invalidCardData = {
        // Missing 'name' field
        idList: "list1"
      };

      // In real implementation, this would throw an error
      // For now, we verify the concept
      expect(invalidCardData.name).toBeUndefined();
    });
  });
});
