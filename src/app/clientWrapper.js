"use client";

import { useEffect } from 'react';
import swDev from './swDev';

export default function ClientWrapper({ children }) {
  useEffect(() => {
    swDev();
  }, []);

  return <>{children}</>;
}
