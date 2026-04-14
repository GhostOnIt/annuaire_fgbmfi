import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BackLink } from '../components/BackLink';
import api from '../api/client';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/chapters').then(({ data }) => setChapters(data)).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!chapterId) {
      toast.error('Veuillez sélectionner votre chapitre');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      toast.success('Inscription réussie');
      navigate(`/profile/edit?chapterId=${chapterId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <BackLink to="/" label="Retour à l'annuaire" />
      <h1 className="text-2xl font-bold text-center mb-6 mt-3 text-dark-900">Inscription</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-dark-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-700">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-dark-700">Chapitre *</label>
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
          >
            <option value="">Sélectionner votre chapitre...</option>
            {chapters.map((ch: any) => (
              <option key={ch.id} value={ch.id}>{ch.name} — {ch.city}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 text-white py-2 rounded-lg hover:bg-gold-400 disabled:opacity-50 transition font-semibold"
        >
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
        <p className="text-center text-sm text-dark-400">
          Déjà un compte ? <Link to="/login" className="text-gold-600 hover:underline font-medium">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
