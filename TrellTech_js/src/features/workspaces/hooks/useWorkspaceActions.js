import {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } from "../services/workspaceService";
  
  export const useWorkspaceActions = (refetch) => {
  
    const addWorkspace = async (name, desc) => {
      await createWorkspace({ name, desc });
      refetch();
    };
  
    const editWorkspace = async (id, name, desc) => {
      await updateWorkspace(id, { name, desc });
      refetch();
    };
  
    const removeWorkspace = async (id) => {
      await deleteWorkspace(id);
      refetch();
    };
  
    return {
      addWorkspace,
      editWorkspace,
      removeWorkspace,
    };
  };
  