# Integration Testing Guide for TrellTech

This document provides comprehensive instructions for running and understanding the integration tests for the TrellTech React Native application.

## Table of Contents

- [Overview](#overview)
- [Test Architecture](#test-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [What We Test](#what-we-test)
- [Mocking Strategy](#mocking-strategy)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

TrellTech uses **Jest** as the test framework with **Mock Service Worker (MSW)** to intercept API calls. This allows us to test the complete integration between our services and the Trello API without making real network requests.

### Test Coverage

The integration test suite covers:

- **Auth Service**: OAuth flow, token storage, user profile fetching, auto-login, logout
- **Board Service**: CRUD operations for boards (Create, Read, Update, Delete, Archive)
- **Card Service**: CRUD operations for cards, member assignment, moving cards
- **List Service**: CRUD operations for lists, archiving, bulk card movement
- **Workspace Service**: CRUD operations for workspaces, member management

### Technologies Used

- **Jest**: JavaScript testing framework
- **Jest Expo**: Jest preset for Expo/React Native projects
- **MSW (Mock Service Worker)**: API mocking library
- **@testing-library/jest-native**: Additional matchers for React Native
- **@testing-library/react-native**: Testing utilities for React Native components

---

## Test Architecture

```
src/
├── __tests__/
│   ├── integration/           # Integration test files
│   │   ├── authService.test.js
│   │   ├── boardService.test.js
│   │   ├── cardService.test.js
│   │   ├── listService.test.js
│   │   └── workspaceService.test.js
│   ├── mocks/                 # Mock data and handlers
│   │   ├── handlers.js        # MSW request handlers
│   │   └── server.js          # MSW server setup
│   └── setup/                 # Jest configuration
│       ├── jest.setup.js      # Global test setup
│       └── fileMock.js        # Mock for static assets
├── features/                  # Application code
│   ├── auth/
│   ├── boards/
│   ├── cards/
│   ├── lists/
│   └── workspaces/
```

### How It Works

1. **MSW Intercepts API Calls**: When tests run, MSW intercepts all HTTP requests to `https://api.trello.com`
2. **Mock Handlers Return Data**: Instead of hitting real API, MSW handlers return controlled mock data
3. **Tests Verify Behavior**: Tests verify that services correctly process API responses
4. **State is Isolated**: Each test runs in isolation with fresh mock data

---

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (if running the app)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TrellTech_js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Jest Configuration

The project should already have `jest.config.js` configured. Verify it exists in the root directory.

---

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

Watch mode automatically reruns tests when files change:

```bash
npm run test:watch
```

### Run Specific Test File

```bash
npm test -- authService.test.js
```

### Run Tests with Coverage

Generate a coverage report showing which code is tested:

```bash
npm test -- --coverage
```

### Run Integration Tests Only

```bash
npm test -- integration/
```

### Run Specific Test Suite

Run only tests matching a pattern:

```bash
npm test -- --testNamePattern="Auth Service"
```

---

## Test Structure

Each test file follows a consistent structure with extensive comments:

```javascript
describe('Integration Tests - Service Name', () => {

  beforeEach(() => {
    // Reset mock data before each test
  });

  describe('Feature Group', () => {

    test('should do something specific', async () => {
      // 1. Setup: Prepare test data

      // 2. Execute: Call the service method

      // 3. Assert: Verify the result
    });
  });
});
```

### Test Anatomy

Each test includes:

1. **Documentation Comment**: Explains what scenario is being tested
2. **Setup**: Prepares necessary data or mocks
3. **Execution**: Calls the service method being tested
4. **Assertions**: Verifies the expected behavior
5. **Verification**: Checks side effects (e.g., data was stored)

---

## What We Test

### Auth Service Tests

**File**: `src/__tests__/integration/authService.test.js`

- ✅ OAuth login flow with token extraction
- ✅ OAuth cancellation by user
- ✅ OAuth error handling
- ✅ Token storage in AsyncStorage
- ✅ Token retrieval for auto-login
- ✅ User profile fetching with valid token
- ✅ Invalid token handling
- ✅ Complete auto-login workflow
- ✅ Logout functionality
- ✅ Manual token input
- ✅ Network error handling

**Why**: Ensures users can securely authenticate, stay logged in, and log out properly.

### Board Service Tests

**File**: `src/__tests__/integration/boardService.test.js`

- ✅ Create board without workspace
- ✅ Create board within workspace
- ✅ Get all boards for user
- ✅ Get specific board by ID
- ✅ Update board name and description
- ✅ Archive board
- ✅ Delete board
- ✅ Get board lists
- ✅ Complete board lifecycle

**Why**: Verifies users can manage their project boards effectively.

### Card Service Tests

**File**: `src/__tests__/integration/cardService.test.js`

- ✅ Create card with minimal data
- ✅ Create card with full details (name, description, due date)
- ✅ Get cards from list
- ✅ Get specific card by ID
- ✅ Update card fields
- ✅ Move card between lists
- ✅ Delete card
- ✅ Assign/remove members to/from card
- ✅ Get card members
- ✅ Complete card lifecycle

**Why**: Ensures task management features work correctly.

### List Service Tests

**File**: `src/__tests__/integration/listService.test.js`

- ✅ Create list on board
- ✅ Get list by ID
- ✅ Get cards from list
- ✅ Update list name
- ✅ Archive list
- ✅ Move all cards between lists
- ✅ Complete list lifecycle

**Why**: Verifies Kanban board columns can be managed properly.

### Workspace Service Tests

**File**: `src/__tests__/integration/workspaceService.test.js`

- ✅ Create workspace
- ✅ Get all workspaces for user
- ✅ Get specific workspace by ID
- ✅ Get boards from workspace
- ✅ Update workspace details
- ✅ Delete workspace
- ✅ Get workspace members
- ✅ Complete workspace lifecycle

**Why**: Ensures team collaboration features function correctly.

---

## Mocking Strategy

### Mock Service Worker (MSW)

MSW intercepts HTTP requests at the network level. Here's how it works:

#### Example: Mocking Board Creation

**Handler** (`src/__tests__/mocks/handlers.js`):

```javascript
rest.post("https://api.trello.com/1/boards", async (req, res, ctx) => {
  const body = await req.text();
  const params = new URLSearchParams(body);

  const newBoard = {
    id: `board${Date.now()}`,
    name: params.get("name"),
    desc: params.get("desc") || "",
    closed: false,
    // ... other fields
  };

  mockStore.boards.push(newBoard);

  return res(ctx.status(200), ctx.json(newBoard));
})
```

**Test**:

```javascript
test('should create a new board', async () => {
  const newBoard = await boardService.createBoard("Test Board");

  expect(newBoard).toBeDefined();
  expect(newBoard.name).toBe("Test Board");
  expect(mockStore.boards.some(b => b.name === "Test Board")).toBe(true);
});
```

### Why Use MSW Instead of Jest Mocks?

1. **Realistic**: Tests the actual network layer (axios)
2. **Maintainable**: Mock logic is centralized in handlers
3. **Comprehensive**: Tests entire integration, not just units
4. **Easy to Debug**: Can see exact requests/responses

### Mock Data Store

The `mockStore` object maintains state across requests during tests:

```javascript
const mockStore = {
  user: { id: "user123", username: "testuser", ... },
  boards: [...],
  cards: [...],
  lists: [...],
  workspaces: [...]
};
```

This simulates a real database, allowing tests to verify:
- Data is created
- Data persists across operations
- Data is updated correctly
- Data is deleted

---

## Writing New Tests

### Step 1: Add Mock Handler

Add the API endpoint to `src/__tests__/mocks/handlers.js`:

```javascript
rest.get("https://api.trello.com/1/new-endpoint/:id", (req, res, ctx) => {
  const { id } = req.params;
  const item = mockStore.items.find(i => i.id === id);

  if (!item) {
    return res(ctx.status(404), ctx.json({ message: "Not found" }));
  }

  return res(ctx.status(200), ctx.json(item));
})
```

### Step 2: Create Test File

Create a new test file in `src/__tests__/integration/`:

```javascript
import service from '../../features/new-feature/services/service';
import { mockStore } from '../mocks/handlers';

describe('Integration Tests - New Feature Service', () => {

  beforeEach(() => {
    // Reset mock data
    mockStore.items = [...];
  });

  describe('Create Item', () => {
    test('should create a new item', async () => {
      const result = await service.createItem({ name: "Test" });

      expect(result).toBeDefined();
      expect(result.name).toBe("Test");
    });
  });
});
```

### Step 3: Run Your Tests

```bash
npm test -- newFeatureService.test.js
```

---

## Troubleshooting

### Tests Fail with "Network request failed"

**Cause**: MSW server isn't running or handler is missing.

**Solution**:
1. Check that `jest.setup.js` starts the MSW server
2. Verify the API endpoint has a matching handler in `handlers.js`
3. Check for typos in the endpoint URL

### Tests Fail with "Cannot read property of undefined"

**Cause**: Mock data isn't properly reset between tests.

**Solution**:
- Ensure `beforeEach()` resets `mockStore` to initial state
- Check that the handler returns the expected data structure

### AsyncStorage Mock Not Working

**Cause**: AsyncStorage needs to be mocked globally.

**Solution**:
- Verify mock is defined in the test file:
  ```javascript
  jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }));
  ```

### Tests Pass Locally But Fail in CI

**Cause**: Environment differences or timing issues.

**Solution**:
1. Check Node.js version matches
2. Ensure all dependencies are installed
3. Add explicit waits for async operations

### MSW Warnings About Unhandled Requests

**Cause**: A request was made that doesn't have a handler.

**Solution**:
- Check the console for the unhandled URL
- Add a handler for that endpoint in `handlers.js`
- Or add it to the ignore list if it's intentional

---

## Best Practices

### 1. Test Isolation

Each test should be independent and not rely on other tests:

```javascript
beforeEach(() => {
  // Reset all mock data
  mockStore.boards = [...initialBoards];
});
```

### 2. Descriptive Test Names

Use clear, descriptive test names that explain what is being tested:

```javascript
// ✅ Good
test('should create a board with name and description', async () => { ... });

// ❌ Bad
test('create board', async () => { ... });
```

### 3. Follow AAA Pattern

Structure tests with Arrange-Act-Assert:

```javascript
test('should update board name', async () => {
  // Arrange: Setup test data
  const boardId = "board1";
  const newName = "Updated Name";

  // Act: Execute the operation
  const result = await boardService.updateBoard(boardId, { name: newName });

  // Assert: Verify the result
  expect(result.name).toBe(newName);
  expect(mockStore.boards.find(b => b.id === boardId).name).toBe(newName);
});
```

### 4. Test Edge Cases

Don't just test the happy path:

```javascript
test('should throw error when board not found', async () => {
  await expect(
    boardService.getBoardById("nonexistent")
  ).rejects.toThrow();
});
```

### 5. Use Comments Liberally

Integration tests should be understandable by beginners:

```javascript
/**
 * TEST: Complete board lifecycle
 *
 * SCENARIO:
 * 1. Create board
 * 2. Update board
 * 3. Archive board
 * 4. Delete board
 *
 * ASSERTION: Verify entire lifecycle works end-to-end
 */
test('should handle complete board lifecycle', async () => { ... });
```

### 6. Don't Mock What You're Testing

Only mock external dependencies (API, storage), not the code under test:

```javascript
// ✅ Good: Mock AsyncStorage (external dependency)
jest.mock('@react-native-async-storage/async-storage');

// ❌ Bad: Mock the service you're testing
jest.mock('../../features/boards/services/boardService');
```

### 7. Verify Side Effects

Check that operations have the expected side effects:

```javascript
test('should store token in AsyncStorage', async () => {
  await authService.login(token);

  // Verify side effect
  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    'auth-token',
    token
  );
});
```

---

## Test Command Reference

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm test -- --coverage

# Run specific test file
npm test -- boardService.test.js

# Run specific test suite
npm test -- --testNamePattern="Board Service"

# Run tests matching pattern
npm test -- --testPathPattern=integration

# Run tests with verbose output
npm test -- --verbose

# Update snapshots (if using snapshot testing)
npm test -- --updateSnapshot

# Run tests without cache
npm test -- --no-cache

# Run tests in CI mode
npm test -- --ci --coverage
```

---

## Understanding Test Output

### Successful Test Run

```
PASS  src/__tests__/integration/boardService.test.js
  Integration Tests - Board Service
    Create Board
      ✓ should create a new board without workspace (45ms)
      ✓ should create board within workspace (32ms)
    Read Boards
      ✓ should retrieve all boards for the user (28ms)
      ✓ should retrieve specific board by ID (25ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        2.453s
```

### Failed Test

```
FAIL  src/__tests__/integration/boardService.test.js
  Integration Tests - Board Service
    Create Board
      ✕ should create a new board (50ms)

  ● Integration Tests - Board Service › Create Board › should create a new board

    expect(received).toBe(expected)

    Expected: "Test Board"
    Received: undefined

      at Object.<anonymous> (src/__tests__/integration/boardService.test.js:35:29)
```

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MSW Documentation](https://mswjs.io/docs/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Contributing

When adding new features:

1. Write integration tests for new services
2. Update MSW handlers with new endpoints
3. Ensure all tests pass before submitting PR
4. Maintain test coverage above 80%

---

## Questions or Issues?

If you encounter problems with the tests:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review test comments for explanations
3. Run tests with `--verbose` flag for more details
4. Check MSW console warnings for unhandled requests

Happy Testing! 🧪✅
