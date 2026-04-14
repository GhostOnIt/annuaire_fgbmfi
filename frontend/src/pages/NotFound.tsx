import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gold-500">404</h1>
      <p className="text-xl text-dark-600 mt-4">Page introuvable</p>
      <p className="text-dark-400 mt-2">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="inline-block mt-6 bg-gold-500 text-white px-6 py-2.5 rounded-lg hover:bg-gold-400 transition font-semibold"
      >
        Retour à l'annuaire
      </Link>
    </div>
  );
}
