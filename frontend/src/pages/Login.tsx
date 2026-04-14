import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BackLink } from '../components/BackLink';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <BackLink to="/" label="Retour à l'annuaire" />
      <h1 className="text-2xl font-bold text-center mb-6 mt-3 text-dark-900">Connexion</h1>
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
            className="w-full px-3 py-2 border border-dark-200 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 text-white py-2 rounded-lg hover:bg-gold-400 disabled:opacity-50 transition font-semibold"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className="text-center text-sm text-dark-400">
          Pas de compte ? <Link to="/register" className="text-gold-600 hover:underline font-medium">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
}
