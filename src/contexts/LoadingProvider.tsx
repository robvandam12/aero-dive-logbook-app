
import React, { createContext, useContext, useState } from 'react';

interface LoadingContextType {
  isInitialLoad: boolean;
  setIsInitialLoad: (loading: boolean) => void;
  hasNavigated: boolean;
  setHasNavigated: (navigated: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  return (
    <LoadingContext.Provider value={{
      isInitialLoad,
      setIsInitialLoad,
      hasNavigated,
      setHasNavigated,
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
