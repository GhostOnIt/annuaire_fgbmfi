import { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-dark-950 text-dark-400 text-center py-4 text-sm border-t border-gold-600/30">
        <span className="text-gold-500">FGBMFI</span> Annuaire &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
