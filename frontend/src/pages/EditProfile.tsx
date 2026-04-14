import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BackLink } from '../components/BackLink';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [chapters, setChapters] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [chapterRoles, setChapterRoles] = useState<any[]>([]);
  const [existingMember, setExistingMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    description: '',
    chapterRole: '',
    chapterId: searchParams.get('chapterId') || '',
    sectorId: '',
  });

  // Charger les données de référence (chapitres, secteurs, postes)
  useEffect(() => {
    api.get('/chapters').then(({ data }) => setChapters(data)).catch(console.error);
    api.get('/sectors').then(({ data }) => setSectors(data)).catch(console.error);
    api.get('/chapter-roles').then(({ data }) => setChapterRoles(data)).catch(console.error);
  }, []);

  // Charger le profil existant du membre
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/members/me')
      .then(({ data }) => {
        if (data) {
          setExistingMember(data);
          setForm({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            location: data.location || '',
            description: data.description || '',
            chapterRole: data.chapterRole || '',
            chapterId: data.chapterId,
            sectorId: data.sectorId,
          });
          if (data.services) setServices(data.services.map((s: any) => ({ name: s.name, description: s.description || '' })));
        }
      })
      .catch(() => { /* pas de profil encore */ })
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [services, setServices] = useState<{ name: string; description: string }[]>([]);
  const [newService, setNewService] = useState({ name: '', description: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (existingMember) {
        await api.put(`/members/${existingMember.id}`, { ...form, services });
        toast.success('Profil mis à jour');
      } else {
        const { data } = await api.post('/members', { ...form, services });
        toast.success('Profil créé, en attente de validation');
        setExistingMember(data);

        // Upload photo après création si sélectionnée
        if (photoFile && data.id) {
          const fd = new FormData();
          fd.append('photo', photoFile);
          await api.post(`/members/${data.id}/photo`, fd);
          toast.success('Photo ajoutée');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (existingMember) {
      // Upload immédiat si profil existant
      const fd = new FormData();
      fd.append('photo', file);
      api.post(`/members/${existingMember.id}/photo`, fd)
        .then(() => toast.success('Photo mise à jour'))
        .catch((err: any) => toast.error(err.response?.data?.error || 'Erreur upload'));
    } else {
      // Stocker pour upload après création
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <BackLink to="/" label="Retour à l'annuaire" />
      <h1 className="text-2xl font-bold mb-6 mt-3">
        {existingMember ? 'Modifier mon profil' : 'Créer mon profil'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-dark-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Photo de profil</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-dark-100 flex items-center justify-center overflow-hidden border-2 border-dark-200">
              {photoPreview ? (
                <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
              ) : existingMember?.photo ? (
                <img src={existingMember.photo} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-dark-300">
                  {form.firstName?.[0] || '?'}{form.lastName?.[0] || ''}
                </span>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
              <p className="text-xs text-dark-400 mt-1">JPG, PNG ou WebP. Max 5 Mo.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Localisation</label>
          <input name="location" value={form.location} onChange={handleChange} className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chapitre *</label>
            <select name="chapterId" value={form.chapterId} onChange={handleChange} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none">
              <option value="">Sélectionner...</option>
              {chapters.map((ch: any) => (
                <option key={ch.id} value={ch.id}>{ch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poste dans le chapitre</label>
            <select name="chapterRole" value={form.chapterRole} onChange={handleChange} className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none">
              <option value="">Sélectionner...</option>
              {chapterRoles.map((role: any) => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Secteur *</label>
            <select name="sectorId" value={form.sectorId} onChange={handleChange} required className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none">
              <option value="">Sélectionner...</option>
              {sectors.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description des services</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none resize-none" />
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium mb-2">Services proposés</label>
          {services.length > 0 && (
            <div className="space-y-2 mb-3">
              {services.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-dark-50 rounded-lg px-3 py-2">
                  <div className="flex-1">
                    <span className="font-medium text-sm text-dark-900">{s.name}</span>
                    {s.description && <span className="text-xs text-dark-400 ml-2">— {s.description}</span>}
                  </div>
                  <button type="button" onClick={() => setServices(services.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 text-sm">
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              placeholder="Nom du service"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-dark-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            />
            <input
              placeholder="Description (optionnel)"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="flex-1 px-3 py-2 border border-dark-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (!newService.name.trim()) return;
                setServices([...services, { name: newService.name.trim(), description: newService.description.trim() }]);
                setNewService({ name: '', description: '' });
              }}
              className="px-3 py-2 bg-dark-950 text-gold-400 rounded-lg hover:bg-dark-800 transition text-sm"
            >
              Ajouter
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-gold-500 text-white py-2 rounded-lg hover:bg-gold-400 transition font-semibold">
          {existingMember ? 'Mettre à jour' : 'Créer mon profil'}
        </button>
      </form>
    </div>
  );
}
