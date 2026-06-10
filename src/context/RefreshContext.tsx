import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type RefreshContextType = {
  refreshKey: number;

  refreshing: boolean;

  triggerRefresh: () => void;
};

const RefreshContext = createContext<RefreshContextType | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshing(true);

    setRefreshKey((prev) => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  }, []);

  return (
    <RefreshContext.Provider
      value={{
        refreshKey,

        refreshing,

        triggerRefresh,
      }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);

  if (!context) {
    throw new Error("useRefresh must be used inside RefreshProvider");
  }

  return context;
}