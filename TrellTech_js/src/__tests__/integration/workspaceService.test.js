import {
  getMyWorkspaces,
  createWorkspace
} from "../../src/features/workspaces/services/workspaceService";

jest.mock("../../src/store/authStore", () => ({
  getAuthToken: () => "FAKE_TOKEN"
}));

describe("Integration - Workspace Service", () => {
  test("getMyWorkspaces récupère la liste mocked", async () => {
    const res = await getMyWorkspaces();
    expect(res).toHaveLength(2);
    expect(res[0].displayName).toBe("Workspace A");
  });

  test("createWorkspace crée un workspace", async () => {
    const newWs = await createWorkspace({
      displayName: "New WS",
      desc: "",
    });

    expect(newWs.id).toBe("new123");
    expect(newWs.displayName).toBe("New WS");
  });
});
