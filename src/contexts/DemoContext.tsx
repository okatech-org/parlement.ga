import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface DemoContextType {
  currentUser: DemoUser | null;
  setCurrentUser: (user: DemoUser | null) => void;
  isDemo: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);

  return (
    <DemoContext.Provider value={{ currentUser, setCurrentUser, isDemo: !!currentUser }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    // Return safe defaults if not wrapped in provider
    return { currentUser: null, setCurrentUser: () => {}, isDemo: false };
  }
  return context;
}
