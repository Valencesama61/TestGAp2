# Quick Start - Running Integration Tests

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs all testing dependencies (Jest, MSW, Testing Library).

### Step 2: Run the Tests

```bash
npm test
```

This runs all integration tests for all services.

### Step 3: View Results

You'll see output like:

```
PASS  src/__tests__/integration/authService.test.js
PASS  src/__tests__/integration/boardService.test.js
PASS  src/__tests__/integration/cardService.test.js
PASS  src/__tests__/integration/listService.test.js
PASS  src/__tests__/integration/workspaceService.test.js

Test Suites: 5 passed, 5 total
Tests:       120 passed, 120 total
Time:        5.234s
```

---

## 📋 Common Commands

| Command | What It Does |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode (auto-rerun on file changes) |
| `npm test -- --coverage` | Run tests with coverage report |
| `npm test -- authService.test.js` | Run only auth tests |
| `npm test -- boardService.test.js` | Run only board tests |
| `npm test -- --verbose` | Show detailed test output |

---

## 📁 Test Files

All tests are in: `src/__tests__/integration/`

- `authService.test.js` - OAuth login, token storage, logout (12 tests)
- `boardService.test.js` - Board CRUD operations (25+ tests)
- `cardService.test.js` - Card management, member assignment (30+ tests)
- `listService.test.js` - List management, bulk operations (25+ tests)
- `workspaceService.test.js` - Workspace/team management (25+ tests)

---

## 🎯 What's Being Tested?

### ✅ Auth Service
- OAuth login flow
- Token storage & retrieval
- Auto-login for returning users
- Logout functionality

### ✅ Board Service
- Create personal & team boards
- View, update, archive, delete boards
- Get board lists

### ✅ Card Service
- Create & manage tasks
- Add descriptions & due dates
- Move cards between lists
- Assign team members

### ✅ List Service
- Create workflow columns
- Rename & archive lists
- Move cards in bulk

### ✅ Workspace Service
- Create team workspaces
- Manage workspace boards
- View workspace members

---

## 🔍 Understanding Test Output

### ✅ All Tests Pass

```
PASS  src/__tests__/integration/boardService.test.js
  Integration Tests - Board Service
    Create Board
      ✓ should create a new board without workspace (45ms)
      ✓ should create board within workspace (32ms)
    Read Boards
      ✓ should retrieve all boards for the user (28ms)
```

**Everything works! 🎉**

### ❌ Test Fails

```
FAIL  src/__tests__/integration/boardService.test.js
  ● Integration Tests - Board Service › should create board

    expect(received).toBe(expected)

    Expected: "Test Board"
    Received: undefined

      at boardService.test.js:35:29
```

**Check the service implementation - something's not working correctly.**

---

## 🐛 Quick Troubleshooting

### Problem: Tests fail with "Network request failed"

**Solution**: MSW might not be intercepting requests. Check that:
- `jest.setup.js` is configured correctly
- Handlers exist for the endpoint in `handlers.js`

### Problem: Tests fail with "Cannot read property of undefined"

**Solution**: Mock data might not be reset properly. Check:
- `beforeEach()` resets `mockStore` to initial state
- Handler returns the expected data structure

### Problem: "Preset jest-expo not found"

**Solution**: Install dependencies:
```bash
npm install --save-dev jest-expo @testing-library/react-native
```

---

## 📚 Need More Info?

- **Detailed Guide**: Read `TESTING.md` for comprehensive documentation
- **Summary**: Read `TEST_SUMMARY.md` for overview of what was delivered
- **Test Comments**: Open any test file - they have extensive explanatory comments

---

## 💡 Tips

1. **Start with auth tests** - They're the most beginner-friendly
2. **Read the comments** - Every test has explanations
3. **Run in watch mode** - Auto-rerun tests while developing
4. **Check coverage** - See what code is tested
5. **Use verbose mode** - See detailed output when debugging

---

## 🎓 Learning Path

1. Run all tests to see them pass ✅
2. Open `authService.test.js` and read the comments 📖
3. Run just auth tests: `npm test -- authService.test.js` 🧪
4. Explore other test files (boards, cards, lists, workspaces) 🔍
5. Read `TESTING.md` for complete documentation 📚
6. Try writing your own test! 🚀

---

## ✨ You Have

- **~120 integration tests** covering all services
- **~3,800 lines** of production-quality test code
- **Complete API mocking** with MSW
- **Detailed documentation** in TESTING.md
- **Beginner-friendly comments** explaining concepts

**Everything is ready to use!** 🎉

---

## 🚀 Next Steps

```bash
# 1. Run the tests
npm test

# 2. See them pass
# ✓ All tests passed!

# 3. Explore the test files
# src/__tests__/integration/*.test.js

# 4. Read the documentation
# TESTING.md
```

Happy Testing! 🧪✅
