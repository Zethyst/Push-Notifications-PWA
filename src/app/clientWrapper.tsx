"use client";

import { useEffect, ReactNode } from 'react';
import swDev from '@/app/swDev'; 

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  useEffect(() => {
    swDev();
  }, []);

  return <>{children}</>;
}
