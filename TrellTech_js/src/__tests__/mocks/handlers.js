import { rest } from "msw";

/**
 * Mock Service Worker (MSW) handlers for Trello API
 * These handlers intercept HTTP requests during tests and return mock responses
 */

// Mock data store for maintaining state across requests during tests
const mockStore = {
  token: "mock_trello_token_12345",
  user: {
    id: "user123",
    fullName: "Test User",
    username: "testuser",
    email: "test@example.com",
    avatarUrl: "https://trello-avatars.s3.amazonaws.com/test.png",
    initials: "TU",
    bio: "Test user bio",
    url: "https://trello.com/testuser"
  },
  boards: [
    {
      id: "board1",
      name: "Test Board 1",
      desc: "Test board description",
      closed: false,
      url: "https://trello.com/b/board1",
      idOrganization: "org1",
      prefs: { backgroundColor: "blue" }
    },
    {
      id: "board2",
      name: "Test Board 2",
      desc: "Another test board",
      closed: false,
      url: "https://trello.com/b/board2",
      idOrganization: null,
      prefs: { backgroundColor: "green" }
    }
  ],
  lists: [
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
  ],
  cards: [
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
  ],
  workspaces: [
    {
      id: "org1",
      name: "test-workspace-1",
      displayName: "Test Workspace 1",
      desc: "Test workspace description",
      url: "https://trello.com/test-workspace-1"
    },
    {
      id: "org2",
      name: "test-workspace-2",
      displayName: "Test Workspace 2",
      desc: "Another workspace",
      url: "https://trello.com/test-workspace-2"
    }
  ]
};

export const handlers = [
  // ============================================
  // AUTH / PROFILE ENDPOINTS
  // ============================================

  /**
   * Get current user profile
   * Used during authentication and profile fetching
   */
  rest.get("https://api.trello.com/1/members/me", (req, res, ctx) => {
    const token = req.url.searchParams.get("token");

    // Simulate authentication failure
    if (!token || token === "invalid_token") {
      return res(
        ctx.status(401),
        ctx.json({ message: "unauthorized permission requested" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(mockStore.user)
    );
  }),

  /**
   * Update user profile
   */
  rest.put("https://api.trello.com/1/members/me", (req, res, ctx) => {
    // In real scenario, we would parse URLSearchParams from body
    return res(
      ctx.status(200),
      ctx.json({
        ...mockStore.user,
        fullName: "Updated User Name"
      })
    );
  }),

  /**
   * Get user's boards (for profile)
   */
  rest.get("https://api.trello.com/1/members/me/boards", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockStore.boards)
    );
  }),

  // ============================================
  // BOARDS ENDPOINTS
  // ============================================

  /**
   * Get a specific board by ID
   */
  rest.get("https://api.trello.com/1/boards/:boardId", (req, res, ctx) => {
    const { boardId } = req.params;
    const board = mockStore.boards.find(b => b.id === boardId);

    if (!board) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Board not found" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(board)
    );
  }),

  /**
   * Create a new board
   */
  rest.post("https://api.trello.com/1/boards", async (req, res, ctx) => {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const newBoard = {
      id: `board${Date.now()}`,
      name: params.get("name"),
      desc: params.get("desc") || "",
      closed: false,
      url: `https://trello.com/b/board${Date.now()}`,
      idOrganization: params.get("idOrganization") || null,
      prefs: { backgroundColor: "blue" }
    };

    mockStore.boards.push(newBoard);

    return res(
      ctx.status(200),
      ctx.json(newBoard)
    );
  }),

  /**
   * Update a board
   */
  rest.put("https://api.trello.com/1/boards/:boardId", async (req, res, ctx) => {
    const { boardId } = req.params;
    const body = await req.text();
    const params = new URLSearchParams(body);

    const boardIndex = mockStore.boards.findIndex(b => b.id === boardId);

    if (boardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Board not found" })
      );
    }

    // Update board fields
    if (params.get("name")) mockStore.boards[boardIndex].name = params.get("name");
    if (params.get("desc")) mockStore.boards[boardIndex].desc = params.get("desc");
    if (params.get("closed")) mockStore.boards[boardIndex].closed = params.get("closed") === "true";

    return res(
      ctx.status(200),
      ctx.json(mockStore.boards[boardIndex])
    );
  }),

  /**
   * Delete a board
   */
  rest.delete("https://api.trello.com/1/boards/:boardId", (req, res, ctx) => {
    const { boardId } = req.params;
    const boardIndex = mockStore.boards.findIndex(b => b.id === boardId);

    if (boardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Board not found" })
      );
    }

    mockStore.boards.splice(boardIndex, 1);

    return res(ctx.status(200), ctx.json({}));
  }),

  /**
   * Get lists from a board
   */
  rest.get("https://api.trello.com/1/boards/:boardId/lists", (req, res, ctx) => {
    const { boardId } = req.params;
    const lists = mockStore.lists.filter(l => l.idBoard === boardId);

    return res(
      ctx.status(200),
      ctx.json(lists)
    );
  }),

  // ============================================
  // LISTS ENDPOINTS
  // ============================================

  /**
   * Get a specific list by ID
   */
  rest.get("https://api.trello.com/1/lists/:listId", (req, res, ctx) => {
    const { listId } = req.params;
    const list = mockStore.lists.find(l => l.id === listId);

    if (!list) {
      return res(
        ctx.status(404),
        ctx.json({ message: "List not found" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(list)
    );
  }),

  /**
   * Get cards from a list
   */
  rest.get("https://api.trello.com/1/lists/:listId/cards", (req, res, ctx) => {
    const { listId } = req.params;
    const cards = mockStore.cards.filter(c => c.idList === listId);

    return res(
      ctx.status(200),
      ctx.json(cards)
    );
  }),

  /**
   * Create a new list
   */
  rest.post("https://api.trello.com/1/lists", async (req, res, ctx) => {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const newList = {
      id: `list${Date.now()}`,
      name: params.get("name"),
      closed: false,
      idBoard: params.get("idBoard"),
      pos: parseInt(params.get("pos")) || 1000
    };

    mockStore.lists.push(newList);

    return res(
      ctx.status(200),
      ctx.json(newList)
    );
  }),

  /**
   * Update a list
   */
  rest.put("https://api.trello.com/1/lists/:listId", async (req, res, ctx) => {
    const { listId } = req.params;
    const body = await req.text();
    const params = new URLSearchParams(body);

    const listIndex = mockStore.lists.findIndex(l => l.id === listId);

    if (listIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "List not found" })
      );
    }

    if (params.get("name")) mockStore.lists[listIndex].name = params.get("name");

    return res(
      ctx.status(200),
      ctx.json(mockStore.lists[listIndex])
    );
  }),

  /**
   * Archive a list (close)
   */
  rest.put("https://api.trello.com/1/lists/:listId/closed", async (req, res, ctx) => {
    const { listId } = req.params;
    const body = await req.text();
    const params = new URLSearchParams(body);

    const listIndex = mockStore.lists.findIndex(l => l.id === listId);

    if (listIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "List not found" })
      );
    }

    mockStore.lists[listIndex].closed = params.get("value") === "true";

    return res(
      ctx.status(200),
      ctx.json(mockStore.lists[listIndex])
    );
  }),

  /**
   * Move all cards from one list to another
   */
  rest.post("https://api.trello.com/1/lists/:listId/moveAllCards", async (req, res, ctx) => {
    const { listId } = req.params;
    const body = await req.text();
    const params = new URLSearchParams(body);
    const targetListId = params.get("idList");

    // Move all cards from source list to target list
    mockStore.cards.forEach(card => {
      if (card.idList === listId) {
        card.idList = targetListId;
      }
    });

    return res(ctx.status(200), ctx.json({}));
  }),

  // ============================================
  // CARDS ENDPOINTS
  // ============================================

  /**
   * Get a specific card by ID
   */
  rest.get("https://api.trello.com/1/cards/:cardId", (req, res, ctx) => {
    const { cardId } = req.params;
    const card = mockStore.cards.find(c => c.id === cardId);

    if (!card) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Card not found" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(card)
    );
  }),

  /**
   * Create a new card
   */
  rest.post("https://api.trello.com/1/cards", async (req, res, ctx) => {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const newCard = {
      id: `card${Date.now()}`,
      name: params.get("name"),
      desc: params.get("desc") || "",
      idList: params.get("idList"),
      idBoard: mockStore.lists.find(l => l.idList === params.get("idList"))?.idBoard || "board1",
      due: params.get("due") || null,
      dueComplete: false,
      labels: [],
      idMembers: []
    };

    mockStore.cards.push(newCard);

    return res(
      ctx.status(200),
      ctx.json(newCard)
    );
  }),

  /**
   * Update a card
   */
  rest.put("https://api.trello.com/1/cards/:cardId", async (req, res, ctx) => {
    const { cardId } = req.params;

    // Check if idList is in query params (for moveCard)
    const idListParam = req.url.searchParams.get("idList");

    const cardIndex = mockStore.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Card not found" })
      );
    }

    // Update from query params first (for moveCard)
    if (idListParam) {
      mockStore.cards[cardIndex].idList = idListParam;
    }

    // Then check body params
    const body = await req.text();
    if (body) {
      const params = new URLSearchParams(body);
      // Update card fields from body
      if (params.get("name")) mockStore.cards[cardIndex].name = params.get("name");
      if (params.get("desc")) mockStore.cards[cardIndex].desc = params.get("desc");
      if (params.get("idList")) mockStore.cards[cardIndex].idList = params.get("idList");
      if (params.get("due")) mockStore.cards[cardIndex].due = params.get("due");
    }

    return res(
      ctx.status(200),
      ctx.json(mockStore.cards[cardIndex])
    );
  }),

  /**
   * Delete a card
   */
  rest.delete("https://api.trello.com/1/cards/:cardId", (req, res, ctx) => {
    const { cardId } = req.params;
    const cardIndex = mockStore.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Card not found" })
      );
    }

    mockStore.cards.splice(cardIndex, 1);

    return res(ctx.status(200), ctx.json({}));
  }),

  /**
   * Add a member to a card
   */
  rest.post("https://api.trello.com/1/cards/:cardId/idMembers", (req, res, ctx) => {
    const { cardId } = req.params;
    const memberId = req.url.searchParams.get("value");

    const cardIndex = mockStore.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Card not found" })
      );
    }

    if (!mockStore.cards[cardIndex].idMembers.includes(memberId)) {
      mockStore.cards[cardIndex].idMembers.push(memberId);
    }

    return res(
      ctx.status(200),
      ctx.json(mockStore.cards[cardIndex].idMembers)
    );
  }),

  /**
   * Remove a member from a card
   */
  rest.delete("https://api.trello.com/1/cards/:cardId/idMembers/:memberId", (req, res, ctx) => {
    const { cardId, memberId } = req.params;

    const cardIndex = mockStore.cards.findIndex(c => c.id === cardId);

    if (cardIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Card not found" })
      );
    }

    mockStore.cards[cardIndex].idMembers = mockStore.cards[cardIndex].idMembers.filter(
      id => id !== memberId
    );

    return res(ctx.status(200), ctx.json({}));
  }),

  /**
   * Get members of a card
   */
  rest.get("https://api.trello.com/1/cards/:cardId/members", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([mockStore.user])
    );
  }),

  /**
   * Get board members (for card assignment)
   */
  rest.get("https://api.trello.com/1/boards/:boardId/members", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([mockStore.user])
    );
  }),

  // ============================================
  // WORKSPACES / ORGANIZATIONS ENDPOINTS
  // ============================================

  /**
   * Get all workspaces/organizations for current user
   */
  rest.get("https://api.trello.com/1/members/me/organizations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockStore.workspaces)
    );
  }),

  /**
   * Get a specific workspace by ID
   */
  rest.get("https://api.trello.com/1/organizations/:workspaceId", (req, res, ctx) => {
    const { workspaceId } = req.params;
    const workspace = mockStore.workspaces.find(w => w.id === workspaceId);

    if (!workspace) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Organization not found" })
      );
    }

    return res(
      ctx.status(200),
      ctx.json(workspace)
    );
  }),

  /**
   * Get boards from a workspace
   */
  rest.get("https://api.trello.com/1/organizations/:workspaceId/boards", (req, res, ctx) => {
    const { workspaceId } = req.params;
    const boards = mockStore.boards.filter(b => b.idOrganization === workspaceId);

    return res(
      ctx.status(200),
      ctx.json(boards)
    );
  }),

  /**
   * Create a new workspace
   */
  rest.post("https://api.trello.com/1/organizations", async (req, res, ctx) => {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const newWorkspace = {
      id: `org${Date.now()}`,
      name: params.get("displayName").toLowerCase().replace(/\s+/g, "-"),
      displayName: params.get("displayName"),
      desc: params.get("desc") || "",
      url: `https://trello.com/${params.get("displayName").toLowerCase().replace(/\s+/g, "-")}`
    };

    mockStore.workspaces.push(newWorkspace);

    return res(
      ctx.status(200),
      ctx.json(newWorkspace)
    );
  }),

  /**
   * Update a workspace
   */
  rest.put("https://api.trello.com/1/organizations/:workspaceId", async (req, res, ctx) => {
    const { workspaceId } = req.params;
    const body = await req.text();
    const params = new URLSearchParams(body);

    const workspaceIndex = mockStore.workspaces.findIndex(w => w.id === workspaceId);

    if (workspaceIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Organization not found" })
      );
    }

    if (params.get("displayName")) {
      mockStore.workspaces[workspaceIndex].displayName = params.get("displayName");
      mockStore.workspaces[workspaceIndex].name = params.get("displayName").toLowerCase().replace(/\s+/g, "-");
    }
    if (params.get("desc")) mockStore.workspaces[workspaceIndex].desc = params.get("desc");

    return res(
      ctx.status(200),
      ctx.json(mockStore.workspaces[workspaceIndex])
    );
  }),

  /**
   * Delete a workspace
   */
  rest.delete("https://api.trello.com/1/organizations/:workspaceId", (req, res, ctx) => {
    const { workspaceId } = req.params;
    const workspaceIndex = mockStore.workspaces.findIndex(w => w.id === workspaceId);

    if (workspaceIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: "Organization not found" })
      );
    }

    mockStore.workspaces.splice(workspaceIndex, 1);

    return res(ctx.status(200), ctx.json({}));
  }),

  /**
   * Get workspace members
   */
  rest.get("https://api.trello.com/1/organizations/:workspaceId/members", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([mockStore.user])
    );
  }),
];

// Export mock store for test assertions
export { mockStore };
