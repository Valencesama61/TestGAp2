import trelloClient from "../../../api/trello/client";
import { trelloEndpoints } from "../../../api/trello/endpoints";

export const getWorkspaces = async () => {
  const response = await trelloClient.get(trelloEndpoints.workspaces.getMine);
  return response.data;
};

export const createWorkspace = async  ({ name, desc }) => {
    const response = await trelloClient.post(trelloEndpoints.workspaces.create, {
    displayName: name,
    desc,
  });
  return response.data;
};

export const updateWorkspace = async (id, { name, desc }) => {
    const response = await trelloClient.put(trelloEndpoints.workspaces.update(id), {
    displayName: name,
    desc,
  });
  return response.data;
};

export const deleteWorkspace = async (id) => {
    const response = await trelloClient.delete(trelloEndpoints.workspaces.delete(id));
    return response.data;
};
