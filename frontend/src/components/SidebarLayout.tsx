import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

type SidebarLayoutProps = {
  children: ReactNode;
  className: string;
};

export default function SidebarLayout({ children, className}: SidebarLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:flex-row md:overflow-hidden">
      <Sidebar />

      <main className={`min-w-0 flex-1 md:overflow-y-auto ${className}`}>
        {children}
      </main>
    </div>
  );
}
