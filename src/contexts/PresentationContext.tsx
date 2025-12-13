import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PresentationContextType {
  showPresentation: boolean;
  startPresentation: () => void;
  stopPresentation: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [showPresentation, setShowPresentation] = useState(false);

  const startPresentation = useCallback(() => {
    setShowPresentation(true);
  }, []);

  const stopPresentation = useCallback(() => {
    setShowPresentation(false);
  }, []);

  return (
    <PresentationContext.Provider value={{ showPresentation, startPresentation, stopPresentation }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}

// Safe version that returns defaults if not in provider
export function usePresentationSafe() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    return {
      showPresentation: false,
      startPresentation: () => {},
      stopPresentation: () => {}
    };
  }
  return context;
}
