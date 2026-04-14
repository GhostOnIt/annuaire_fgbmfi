import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BackLink } from '../components/BackLink';
import { SkeletonProfile } from '../components/Skeleton';
import { StarRating } from '../components/StarRating';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';

export default function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [member, setMember] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [memberRes, reviewsRes] = await Promise.all([
        api.get(`/members/${id}`),
        api.get(`/members/${id}/reviews`),
      ]);
      setMember(memberRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8 space-y-6"><BackLink to="/" label="Retour à l'annuaire" /><SkeletonProfile /></div>;
  if (!member) return <div className="text-center py-12 text-dark-400">Membre introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <BackLink to="/" label="Retour à l'annuaire" />
      <div className="bg-white rounded-lg shadow-md border border-dark-100 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto bg-dark-100 flex items-center justify-center">
            {member.photo ? (
              <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-6xl font-bold text-dark-300">
                {member.firstName[0]}{member.lastName[0]}
              </div>
            )}
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-2xl font-bold text-dark-900">{member.firstName} {member.lastName}</h1>
            {member.chapterRole && (
              <p className="text-sm font-semibold text-gold-700 bg-gold-50 inline-block px-2 py-0.5 rounded mt-1 border border-gold-200">{member.chapterRole}</p>
            )}
            <p className="text-gold-600 font-medium mt-1">{member.sector.name}</p>
            <p className="text-dark-400">{member.chapter.name}</p>

            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Math.round(member.avgRating)} />
              <span className="text-dark-400">
                {member.avgRating.toFixed(1)} ({member.reviewCount} avis)
              </span>
            </div>

            {member.description && (
              <p className="mt-4 text-dark-600">{member.description}</p>
            )}

            <div className="mt-4 space-y-1 text-sm">
              {member.email && <p>Email : <a href={`mailto:${member.email}`} className="text-gold-600 hover:underline">{member.email}</a></p>}
              {member.phone && <p>Tél : <a href={`tel:${member.phone}`} className="text-gold-600 hover:underline">{member.phone}</a></p>}
              {member.whatsapp && <p>WhatsApp : {member.whatsapp}</p>}
              {member.location && <p>Localisation : {member.location}</p>}
            </div>

            {member.services.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2 text-dark-700">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {member.services.map((s: any) => (
                    <span key={s.id} className="bg-dark-950 text-gold-400 px-2 py-1 rounded text-sm">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-dark-900">Avis ({reviews.length})</h2>
        {isAuthenticated && <ReviewForm memberId={member.id} onReviewAdded={fetchData} />}
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
