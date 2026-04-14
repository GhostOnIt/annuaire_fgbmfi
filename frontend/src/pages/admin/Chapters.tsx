import { useState, useEffect } from 'react';
import { BackLink } from '../../components/BackLink';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminChapters() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    const { data } = await api.get('/chapters');
    setChapters(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/chapters/${editId}`, { name, city });
        toast.success('Chapitre modifié');
      } else {
        await api.post('/chapters', { name, city });
        toast.success('Chapitre créé');
      }
      setName('');
      setCity('');
      setEditId(null);
      fetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (ch: any) => {
    setEditId(ch.id);
    setName(ch.name);
    setCity(ch.city);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce chapitre ?')) return;
    try {
      await api.delete(`/chapters/${id}`);
      toast.success('Chapitre supprimé');
      fetchChapters();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  if (loading) return <div className="text-center py-12 text-dark-400">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <BackLink to="/admin" label="Retour au dashboard" />
      <h1 className="text-2xl font-bold text-dark-900">Gestion des chapitres</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-dark-100 p-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-dark-700">Nom</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-dark-700">Ville</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
        </div>
        <button type="submit" className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-400 transition font-semibold">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setName(''); setCity(''); }} className="text-dark-400 hover:text-dark-600">
            Annuler
          </button>
        )}
      </form>

      <div className="bg-white rounded-lg shadow border border-dark-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-950 text-gold-400">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Ville</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Membres</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {chapters.map((ch: any) => (
              <tr key={ch.id} className="hover:bg-gold-50">
                <td className="px-4 py-3 font-medium text-dark-900">{ch.name}</td>
                <td className="px-4 py-3 text-sm text-dark-500">{ch.city}</td>
                <td className="px-4 py-3 text-sm text-dark-400">{ch._count?.members || 0}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(ch)} className="text-gold-600 hover:underline text-sm">Modifier</button>
                  <button onClick={() => handleDelete(ch.id)} className="text-red-600 hover:underline text-sm">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
