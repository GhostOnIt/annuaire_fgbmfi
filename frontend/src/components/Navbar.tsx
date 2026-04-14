import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-dark-950 text-white shadow-lg border-b border-gold-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">

          {/* Gauche : logo */}
          <div className="flex-1">
            <Link to="/" className="text-xl font-bold text-gold-400 tracking-wide">
              FGBMFI Annuaire
            </Link>
          </div>

          {/* Centre : navigation (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-gold-400 transition font-medium">
              Accueil
            </Link>
            <Link to="/rankings" className="hover:text-gold-400 transition font-medium">
              Classements
            </Link>
          </div>

          {/* Droite : actions utilisateur (desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile/edit" className="hover:text-gold-400 transition text-sm">
                  Mon profil
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-gold-400 transition text-sm">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-dark-800 hover:bg-dark-700 border border-dark-600 px-3 py-1 rounded transition text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-dark-950 px-3 py-1 rounded transition text-sm"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-500 text-dark-950 hover:bg-gold-400 px-3 py-1 rounded transition text-sm font-semibold"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Burger (mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-dark-800 transition ml-4"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden border-t border-dark-800 bg-dark-950">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block py-2 hover:text-gold-400 transition">
              Accueil
            </Link>
            <Link to="/rankings" onClick={() => setOpen(false)} className="block py-2 hover:text-gold-400 transition">
              Classements
            </Link>

            <div className="border-t border-dark-800 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile/edit" onClick={() => setOpen(false)} className="block py-2 hover:text-gold-400 transition">
                    Mon profil
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 hover:text-gold-400 transition">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="block w-full text-left py-2 text-red-400 hover:text-red-300 transition"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-dark-950 px-3 py-2 rounded transition text-sm"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center bg-gold-500 text-dark-950 hover:bg-gold-400 px-3 py-2 rounded transition text-sm font-semibold"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
