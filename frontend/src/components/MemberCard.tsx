import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';

interface MemberCardProps {
  member: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string | null;
    avgRating: number;
    reviewCount: number;
    location: string | null;
    chapterRole: string | null;
    chapter: { name: string };
    sector: { name: string };
  };
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link
      to={`/members/${member.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border border-dark-100 hover:border-gold-300"
    >
      <div className="h-48 bg-dark-100 flex items-center justify-center">
        {member.photo ? (
          <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl font-bold text-dark-300">
            {member.firstName[0]}{member.lastName[0]}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-dark-900">
          {member.firstName} {member.lastName}
        </h3>
        {member.chapterRole && (
          <p className="text-xs font-semibold text-gold-700 bg-gold-50 inline-block px-1.5 py-0.5 rounded">{member.chapterRole}</p>
        )}
        <p className="text-sm text-gold-600 font-medium">{member.sector.name}</p>
        <p className="text-sm text-dark-400">{member.chapter.name}</p>
        {member.location && (
          <p className="text-xs text-dark-300 mt-1">{member.location}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={Math.round(member.avgRating)} size="sm" />
          <span className="text-sm text-dark-400">({member.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
