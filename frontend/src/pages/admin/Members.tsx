import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackLink } from '../../components/BackLink';
import api from '../../api/client';
import toast from 'react-hot-toast';

type Filter = 'all' | 'validated' | 'pending';

export default function AdminMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [showForm, setShowForm] = useState(false);
  const [chapters, setChapters] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chapterRoles, setChapterRoles] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',

    phone: '',
    whatsapp: '',
    location: '',
    description: '',
    chapterRole: '',
    chapterId: '',
    sectorId: '',
  });

  const resetForm = () => {
    setForm({ email: '', password: '', firstName: '', lastName: '', contactEmail: '', phone: '', whatsapp: '', location: '', description: '', chapterRole: '', chapterId: '', sectorId: '' });
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/members?filter=${filter}`);
      setMembers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  useEffect(() => {
    api.get('/chapters').then(({ data }) => setChapters(data));
    api.get('/sectors').then(({ data }) => setSectors(data));
    api.get('/chapter-roles').then(({ data }) => setChapterRoles(data));
  }, []);

  const handleValidate = async (id: string) => {
    try {
      await api.put(`/admin/members/${id}/validate`);
      toast.success('Membre validé');
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handleInvalidate = async (id: string) => {
    try {
      await api.put(`/admin/members/${id}/invalidate`);
      toast.success('Membre désactivé');
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce membre et toutes ses données ? Cette action est irréversible.')) return;
    try {
      await api.delete(`/admin/members/${id}`);
      toast.success('Membre supprimé');
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/members', form);
      toast.success('Membre créé avec succès');
      resetForm();
      setShowForm(false);
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const filteredMembers = members.filter((m) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(s) ||
      m.lastName.toLowerCase().includes(s) ||
      m.user?.email?.toLowerCase().includes(s) ||
      m.chapter?.name?.toLowerCase().includes(s) ||
      m.sector?.name?.toLowerCase().includes(s)
    );
  });

  const inputClass = "w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none text-sm";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
      <BackLink to="/admin" label="Retour au dashboard" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des membres</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-400 transition font-semibold"
        >
          + Ajouter un membre
        </button>
      </div>

      {/* Slide-in panel */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${showForm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-dark-950/50"
          onClick={() => setShowForm(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-out ${showForm ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100 bg-dark-950">
              <h2 className="text-lg font-semibold text-gold-400">Nouveau membre</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded hover:bg-dark-800 text-dark-400 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">E-mail *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="utilisateur@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Mot de passe *</label>
                  <input name="password" type="text" value={form.password} onChange={handleChange} required minLength={6} className={inputClass} placeholder="Min. 6 caractères" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Prénom *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Nom *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Téléphone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Téléphone</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} className={inputClass} placeholder="WhatsApp" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Localisation</label>
                  <input name="location" value={form.location} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Chapitre *</label>
                  <select name="chapterId" value={form.chapterId} onChange={handleChange} required className={inputClass}>
                    <option value="">Sélectionner...</option>
                    {chapters.map((ch: any) => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-dark-700">Poste</label>
                  <select name="chapterRole" value={form.chapterRole} onChange={handleChange} className={inputClass}>
                    <option value="">Sélectionner...</option>
                    {chapterRoles.map((role: any) => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-dark-700">Secteur *</label>
                <select name="sectorId" value={form.sectorId} onChange={handleChange} required className={inputClass}>
                  <option value="">Sélectionner...</option>
                  {sectors.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-dark-700">Description des services</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
              </div>

              {/* Footer sticky */}
              <div className="sticky bottom-0 pt-4 pb-2 bg-white border-t border-dark-100 -mx-6 px-6 flex gap-3">
                <button type="submit" className="flex-1 bg-gold-500 text-white py-2.5 rounded-lg hover:bg-gold-400 transition font-semibold">
                  Créer le membre
                </button>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2.5 rounded-lg border border-dark-200 text-dark-500 hover:bg-dark-50 transition">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex rounded-lg overflow-hidden border border-dark-200">
          {([['all', 'Tous'], ['validated', 'Validés'], ['pending', 'En attente']] as [Filter, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm transition ${filter === key ? 'bg-gold-500 text-dark-950 font-semibold' : 'bg-white hover:bg-dark-50'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un membre..."
          className="flex-1 min-w-[200px] px-3 py-2 border border-dark-200 rounded-lg text-sm"
        />
        <span className="text-sm text-dark-400">{filteredMembers.length} membre(s)</span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-dark-400">Chargement...</div>
      ) : filteredMembers.length === 0 ? (
        <p className="text-dark-400 text-center py-8">Aucun membre trouvé.</p>
      ) : (
        <div className="bg-white rounded-lg shadow border border-dark-100 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-950 text-gold-400">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Chapitre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Secteur</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredMembers.map((m: any) => (
                <tr key={m.id} className="hover:bg-gold-50">
                  <td className="px-4 py-3">
                    <Link to={`/members/${m.id}`} className="font-medium text-dark-900 hover:text-gold-600">
                      {m.firstName} {m.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-dark-400">{m.user?.email}</td>
                  <td className="px-4 py-3 text-sm">{m.chapter?.name}</td>
                  <td className="px-4 py-3 text-sm">{m.sector?.name}</td>
                  <td className="px-4 py-3">
                    {m.isValidated ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Validé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {!m.isValidated ? (
                        <button
                          onClick={() => handleValidate(m.id)}
                          title="Valider"
                          className="p-1.5 rounded hover:bg-green-100 text-green-600 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleInvalidate(m.id)}
                          title="Désactiver"
                          className="p-1.5 rounded hover:bg-yellow-100 text-yellow-500 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path d="M5.127 3.502 5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0 0 12.75 2h-5.5a2.25 2.25 0 0 0-2.123 1.502ZM1 10.25A2.25 2.25 0 0 1 3.25 8h13.5A2.25 2.25 0 0 1 19 10.25v5.5A2.25 2.25 0 0 1 16.75 18H3.25A2.25 2.25 0 0 1 1 15.75v-5.5ZM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 0 1 5.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 0 0-.123-.002H3.25Z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(m.id)}
                        title="Supprimer"
                        className="p-1.5 rounded hover:bg-red-100 text-red-600 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
