import { createContext, useContext, useState, useEffect } from "react";
import axios from "../AxiosInstance";

export const SidebarContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarContextProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const fetchedConversations = await getConversations();
        setConversations(fetchedConversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getConversations = async () => {
    try {
      const { data } = await axios.get("chat");
      return data;
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      return [];
    }
  };

  return (
    <SidebarContext.Provider value={{ conversations, loading }}>
      {children}
    </SidebarContext.Provider>
  );
};
