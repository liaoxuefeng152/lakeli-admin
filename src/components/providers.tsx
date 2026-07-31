'use client';

import { AuthProvider } from '@/lib/auth';
import ModuleTheme from '@/components/layout/module-theme';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ModuleTheme />
      {children}
      <Toaster />
    </AuthProvider>
  );
}
