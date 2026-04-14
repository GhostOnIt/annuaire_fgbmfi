import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackLink } from '../components/BackLink';
import { StarRating } from '../components/StarRating';
import api from '../api/client';

export default function Rankings() {
  const [type, setType] = useState<'sector' | 'chapter'>('sector');
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const endpoint = type === 'sector' ? '/sectors' : '/chapters';
    api.get(endpoint).then(({ data }) => {
      setItems(data);
      setSelectedId('');
    });
  }, [type]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ type });
    if (selectedId) params.set('id', selectedId);
    api.get(`/admin/rankings?${params}`)
      .then(({ data }) => setRankings(data))
      .catch(() => setRankings([]))
      .finally(() => setLoading(false));
  }, [type, selectedId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <BackLink to="/" label="Retour à l'annuaire" />
      <h1 className="text-2xl font-bold text-center text-dark-900">Classements</h1>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setType('sector')}
          className={`px-4 py-2 rounded-lg transition font-medium ${type === 'sector' ? 'bg-gold-500 text-dark-950' : 'bg-white border border-dark-200 text-dark-600 hover:border-gold-400'}`}
        >
          Par secteur
        </button>
        <button
          onClick={() => setType('chapter')}
          className={`px-4 py-2 rounded-lg transition font-medium ${type === 'chapter' ? 'bg-gold-500 text-dark-950' : 'bg-white border border-dark-200 text-dark-600 hover:border-gold-400'}`}
        >
          Par chapitre
        </button>
      </div>

      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full px-3 py-2 border border-dark-200 rounded-lg bg-white focus:ring-2 focus:ring-gold-400 outline-none"
      >
        <option value="">Tous</option>
        {items.map((item: any) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>

      {loading ? (
        <div className="text-center py-8 text-dark-400">Chargement...</div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-8 text-dark-400">Aucun résultat</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-dark-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-950 text-gold-400">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Membre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{type === 'sector' ? 'Secteur' : 'Chapitre'}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Note</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Avis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {rankings.map((member: any, index: number) => (
                <tr key={member.id} className="hover:bg-gold-50">
                  <td className="px-4 py-3 font-bold text-gold-600">{index + 1}</td>
                  <td className="px-4 py-3">
                    <Link to={`/members/${member.id}`} className="text-dark-900 hover:text-gold-600 font-medium">
                      {member.firstName} {member.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-400">
                    {type === 'sector' ? member.sector?.name : member.chapter?.name}
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={Math.round(member.avgRating)} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-400">{member.reviewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
