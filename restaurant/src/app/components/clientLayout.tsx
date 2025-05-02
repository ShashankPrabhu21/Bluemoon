"use client";

import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event?.message?.includes('ChunkLoadError')) {
        window.location.reload();
      }
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  return <main>{children}</main>;
};

export default ClientLayout;