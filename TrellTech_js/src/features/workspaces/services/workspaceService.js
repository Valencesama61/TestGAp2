import trelloClient from "../../../api/trello/client";
import { WORKSPACES_ENDPOINTS } from "../../../api/trello/endpoints";
//import { trelloEndpoints } from "../../../api/trello/endpoints";

export const getWorkspaces = async () => {
  const response = await trelloClient.get(WORKSPACES_ENDPOINTS.getAll);
  return response.data;
};

export const createWorkspace = async  ({ name, desc }) => {
    const response = await trelloClient.post(WORKSPACES_ENDPOINTS.create, {
    displayName: name,
    desc,
  });
  return response.data;
};

export const updateWorkspace = async (id, { name, desc }) => {
    const response = await trelloClient.put(WORKSPACES_ENDPOINTS.update(id), {
    displayName: name,
    desc,
  });
  return response.data;
};

export const deleteWorkspace = async (id) => {
    const response = await trelloClient.delete(WORKSPACES_ENDPOINTS.delete(id));
    return response.data;
};
