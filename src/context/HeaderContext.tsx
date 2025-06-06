'use client';

import React, { createContext, useContext, useState } from 'react';

interface HeaderContextType {
  showTemporaryMessage: (message: string) => void;
  temporaryMessage: string | null;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [temporaryMessage, setTemporaryMessage] = useState<string | null>(null);

  const showTemporaryMessage = (message: string) => {
    setTemporaryMessage(message);
    setTimeout(() => {
      setTemporaryMessage(null);
    }, 2000);
  };

  return (
    <HeaderContext.Provider value={{ showTemporaryMessage, temporaryMessage }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
} 