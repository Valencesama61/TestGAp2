import { useEffect, useState } from "react";
import { getWorkspaces } from "../services/workspaceService";

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   console.log("USE WORKSPACES EXECUTED");

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await getWorkspaces();
      console.log("DATA RECEIVED:", data);
    //   console.log("TYPE OF DATA:", Array.isArray(data));


      setWorkspaces(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    loading,
    error,
    refetch: fetchWorkspaces,
  };
};
