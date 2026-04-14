import { Link, useNavigate } from 'react-router-dom';

interface BackLinkProps {
  to?: string;
  label?: string;
}

export function BackLink({ to, label = 'Retour' }: BackLinkProps) {
  const navigate = useNavigate();

  const arrow = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
    </svg>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-gold-600 transition">
        {arrow}
        {label}
      </Link>
    );
  }

  return (
    <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-gold-600 transition">
      {arrow}
      {label}
    </button>
  );
}
