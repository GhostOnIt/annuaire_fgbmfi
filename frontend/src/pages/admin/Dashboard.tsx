import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackLink } from '../../components/BackLink';
import api from '../../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <div className="text-center py-12 text-dark-400">Chargement...</div>;

  const cards = [
    { label: 'Membres total', value: stats.totalMembers, color: 'bg-dark-950 text-gold-400' },
    { label: 'Membres validés', value: stats.validatedMembers, color: 'bg-green-600 text-white' },
    { label: 'En attente', value: stats.pendingMembers, color: 'bg-gold-500 text-dark-950' },
    { label: 'Avis total', value: stats.totalReviews, color: 'bg-dark-800 text-gold-300' },
    { label: 'Chapitres', value: stats.totalChapters, color: 'bg-dark-700 text-white' },
    { label: 'Secteurs', value: stats.totalSectors, color: 'bg-gold-600 text-white' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <BackLink to="/" label="Retour à l'annuaire" />
      <h1 className="text-2xl font-bold text-dark-900">Dashboard Admin</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow border border-dark-100 p-4">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center font-bold text-lg mb-2`}>
              {card.value}
            </div>
            <p className="text-sm text-dark-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/members" className="bg-white rounded-lg shadow border border-dark-100 p-4 hover:border-gold-400 hover:shadow-md transition">
          <h3 className="font-semibold text-dark-900">Gestion des membres</h3>
          <p className="text-sm text-dark-400">Voir, ajouter, valider ou supprimer des membres</p>
        </Link>
        <Link to="/admin/reviews" className="bg-white rounded-lg shadow border border-dark-100 p-4 hover:border-gold-400 hover:shadow-md transition">
          <h3 className="font-semibold text-dark-900">Modération des avis</h3>
          <p className="text-sm text-dark-400">Gérer les avis des membres</p>
        </Link>
        <Link to="/admin/chapters" className="bg-white rounded-lg shadow border border-dark-100 p-4 hover:border-gold-400 hover:shadow-md transition">
          <h3 className="font-semibold text-dark-900">Chapitres</h3>
          <p className="text-sm text-dark-400">Gérer les chapitres</p>
        </Link>
        <Link to="/admin/sectors" className="bg-white rounded-lg shadow border border-dark-100 p-4 hover:border-gold-400 hover:shadow-md transition">
          <h3 className="font-semibold text-dark-900">Secteurs</h3>
          <p className="text-sm text-dark-400">Gérer les secteurs d'activité</p>
        </Link>
        <Link to="/admin/chapter-roles" className="bg-white rounded-lg shadow border border-dark-100 p-4 hover:border-gold-400 hover:shadow-md transition">
          <h3 className="font-semibold text-dark-900">Postes de chapitre</h3>
          <p className="text-sm text-dark-400">Gérer les postes (Président, Trésorier...)</p>
        </Link>
      </div>
    </div>
  );
}
