import { useState, useEffect } from 'react';
import { BackLink } from '../../components/BackLink';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminChapterRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    const { data } = await api.get('/chapter-roles');
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/chapter-roles/${editId}`, { name });
        toast.success('Poste modifié');
      } else {
        await api.post('/chapter-roles', { name });
        toast.success('Poste créé');
      }
      setName('');
      setEditId(null);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handleEdit = (r: any) => {
    setEditId(r.id);
    setName(r.name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce poste ?')) return;
    try {
      await api.delete(`/chapter-roles/${id}`);
      toast.success('Poste supprimé');
      fetchRoles();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  if (loading) return <div className="text-center py-12 text-dark-400">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <BackLink to="/admin" label="Retour au dashboard" />
      <h1 className="text-2xl font-bold text-dark-900">Gestion des postes de chapitre</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-dark-100 p-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-dark-700">Nom du poste</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" placeholder="Ex: Président, Trésorière..." />
        </div>
        <button type="submit" className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-400 transition font-semibold">
          {editId ? 'Modifier' : 'Ajouter'}
        </button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setName(''); }} className="text-dark-400 hover:text-dark-600">
            Annuler
          </button>
        )}
      </form>

      <div className="bg-white rounded-lg shadow border border-dark-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-950 text-gold-400">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Nom du poste</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {roles.map((r: any) => (
              <tr key={r.id} className="hover:bg-gold-50">
                <td className="px-4 py-3 font-medium text-dark-900">{r.name}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleEdit(r)} className="text-gold-600 hover:underline text-sm">Modifier</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline text-sm">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
