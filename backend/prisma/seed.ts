import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Chapitres
  const chapters = await Promise.all([
    prisma.chapter.upsert({ where: { name: 'Paris Centre' }, update: {}, create: { name: 'Paris Centre', city: 'Paris' } }),
    prisma.chapter.upsert({ where: { name: 'Lyon Presqu\'ile' }, update: {}, create: { name: 'Lyon Presqu\'ile', city: 'Lyon' } }),
    prisma.chapter.upsert({ where: { name: 'Marseille Vieux-Port' }, update: {}, create: { name: 'Marseille Vieux-Port', city: 'Marseille' } }),
    prisma.chapter.upsert({ where: { name: 'Bordeaux Centre' }, update: {}, create: { name: 'Bordeaux Centre', city: 'Bordeaux' } }),
    prisma.chapter.upsert({ where: { name: 'Toulouse Capitole' }, update: {}, create: { name: 'Toulouse Capitole', city: 'Toulouse' } }),
  ]);

  // Secteurs
  const sectors = await Promise.all([
    prisma.sector.upsert({ where: { name: 'Bâtiment & Construction' }, update: {}, create: { name: 'Bâtiment & Construction' } }),
    prisma.sector.upsert({ where: { name: 'Commerce & Distribution' }, update: {}, create: { name: 'Commerce & Distribution' } }),
    prisma.sector.upsert({ where: { name: 'Informatique & Tech' }, update: {}, create: { name: 'Informatique & Tech' } }),
    prisma.sector.upsert({ where: { name: 'Santé & Bien-être' }, update: {}, create: { name: 'Santé & Bien-être' } }),
    prisma.sector.upsert({ where: { name: 'Finance & Assurance' }, update: {}, create: { name: 'Finance & Assurance' } }),
    prisma.sector.upsert({ where: { name: 'Éducation & Formation' }, update: {}, create: { name: 'Éducation & Formation' } }),
    prisma.sector.upsert({ where: { name: 'Transport & Logistique' }, update: {}, create: { name: 'Transport & Logistique' } }),
    prisma.sector.upsert({ where: { name: 'Restauration & Hôtellerie' }, update: {}, create: { name: 'Restauration & Hôtellerie' } }),
  ]);

  // Postes de chapitre
  const chapterRolesData = [
    'Président', 'Présidente',
    'Vice-président', 'Vice-présidente',
    'Secrétaire principal', 'Secrétaire principale',
    'Trésorier', 'Trésorière',
    'Chargé des effectifs', 'Chargée des effectifs',
    'Chargé des équipes de feu', 'Chargée des équipes de feu',
    'Membre',
  ];
  for (const roleName of chapterRolesData) {
    await prisma.chapterRole.upsert({ where: { name: roleName }, update: {}, create: { name: roleName } });
  }

  // Admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@fgbmfi.org' },
    update: {},
    create: {
      email: 'admin@fgbmfi.org',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Membres de test
  const membersData = [
    {
      email: 'jean.dupont@email.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '06 12 34 56 78',
      whatsapp: '+33612345678',
      location: 'Paris 8e',
      chapterRole: 'Président',
      description: 'Développeur web fullstack avec 10 ans d\'expérience. Spécialisé en React, Node.js et architectures cloud. Accompagnement de startups et PME dans leur transformation digitale.',
      chapterIndex: 0, // Paris Centre
      sectorIndex: 2,  // Informatique & Tech
      services: [
        { name: 'Développement web', description: 'Sites vitrines, e-commerce, applications web sur mesure' },
        { name: 'Consulting IT', description: 'Audit technique et accompagnement digital' },
      ],
    },
    {
      email: 'marie.konan@email.com',
      firstName: 'Marie',
      lastName: 'Konan',
      phone: '06 23 45 67 89',
      location: 'Lyon 3e',
      chapterRole: 'Secrétaire principale',
      description: 'Architecte d\'intérieur et décoratrice. Je conçois des espaces de vie et de travail qui reflètent votre personnalité. Résidentiel et commercial.',
      chapterIndex: 1, // Lyon Presqu'ile
      sectorIndex: 0,  // Bâtiment & Construction
      services: [
        { name: 'Architecture d\'intérieur', description: 'Conception et aménagement d\'espaces' },
        { name: 'Décoration', description: 'Conseil en décoration et home staging' },
        { name: 'Suivi de chantier', description: 'Coordination des travaux de A à Z' },
      ],
    },
    {
      email: 'paul.mbeki@email.com',
      firstName: 'Paul',
      lastName: 'Mbeki',
      phone: '06 34 56 78 90',
      whatsapp: '+33634567890',
      location: 'Marseille 1er',
      chapterRole: 'Trésorier',
      description: 'Courtier en assurances et conseiller en gestion de patrimoine. Plus de 15 ans d\'expérience au service des particuliers et des professionnels.',
      chapterIndex: 2, // Marseille Vieux-Port
      sectorIndex: 4,  // Finance & Assurance
      services: [
        { name: 'Assurance professionnelle', description: 'RC Pro, multirisque, prévoyance' },
        { name: 'Gestion de patrimoine', description: 'Placements, épargne, optimisation fiscale' },
      ],
    },
    {
      email: 'sarah.bernard@email.com',
      firstName: 'Sarah',
      lastName: 'Bernard',
      phone: '06 45 67 89 01',
      location: 'Bordeaux',
      chapterRole: 'Vice-présidente',
      description: 'Naturopathe et coach bien-être certifiée. Je vous accompagne vers un mode de vie plus sain et équilibré grâce à des méthodes naturelles.',
      chapterIndex: 3, // Bordeaux Centre
      sectorIndex: 3,  // Santé & Bien-être
      services: [
        { name: 'Naturopathie', description: 'Consultations individuelles et bilans de vitalité' },
        { name: 'Coaching bien-être', description: 'Programmes personnalisés alimentation et lifestyle' },
      ],
    },
    {
      email: 'david.osei@email.com',
      firstName: 'David',
      lastName: 'Osei',
      phone: '06 56 78 90 12',
      whatsapp: '+33656789012',
      location: 'Toulouse',
      chapterRole: 'Chargé des effectifs',
      description: 'Formateur et consultant en management. Certifié PMP et Scrum Master. J\'aide les équipes et les leaders à atteindre leur plein potentiel.',
      chapterIndex: 4, // Toulouse Capitole
      sectorIndex: 5,  // Éducation & Formation
      services: [
        { name: 'Formation management', description: 'Leadership, gestion d\'équipe, communication' },
        { name: 'Coaching professionnel', description: 'Accompagnement individuel des dirigeants' },
        { name: 'Conseil en organisation', description: 'Optimisation des processus et méthodes agiles' },
      ],
    },
    {
      email: 'amina.diallo@email.com',
      firstName: 'Amina',
      lastName: 'Diallo',
      phone: '06 67 89 01 23',
      location: 'Paris 11e',
      chapterRole: 'Chargée des équipes de feu',
      description: 'Restauratrice et traiteur spécialisée en cuisine africaine et fusion. Événements, mariages, séminaires d\'entreprise.',
      chapterIndex: 0, // Paris Centre
      sectorIndex: 7,  // Restauration & Hôtellerie
      services: [
        { name: 'Traiteur événementiel', description: 'Buffets et menus pour tous types d\'événements' },
        { name: 'Cours de cuisine', description: 'Ateliers cuisine africaine et fusion' },
      ],
    },
    {
      email: 'eric.martin@email.com',
      firstName: 'Éric',
      lastName: 'Martin',
      phone: '06 78 90 12 34',
      location: 'Lyon 6e',
      chapterRole: 'Trésorier',
      description: 'Gérant d\'une société de transport et logistique. Livraisons express, déménagements professionnels et stockage sécurisé en Rhône-Alpes.',
      chapterIndex: 1, // Lyon Presqu'ile
      sectorIndex: 6,  // Transport & Logistique
      services: [
        { name: 'Transport express', description: 'Livraisons urgentes en région Rhône-Alpes' },
        { name: 'Déménagement', description: 'Déménagements particuliers et entreprises' },
        { name: 'Stockage', description: 'Entreposage sécurisé courte et longue durée' },
      ],
    },
    {
      email: 'claire.nzamba@email.com',
      firstName: 'Claire',
      lastName: 'Nzamba',
      phone: '06 89 01 23 45',
      whatsapp: '+33689012345',
      location: 'Marseille 6e',
      chapterRole: 'Présidente',
      description: 'Commerçante et importatrice de produits cosmétiques naturels d\'Afrique. Vente en boutique et en ligne. Marque propre "Beauté d\'Afrique".',
      chapterIndex: 2, // Marseille Vieux-Port
      sectorIndex: 1,  // Commerce & Distribution
      services: [
        { name: 'Vente cosmétiques', description: 'Produits de beauté naturels africains' },
        { name: 'Distribution B2B', description: 'Fourniture pour salons de coiffure et instituts' },
      ],
    },
    {
      email: 'samuel.aka@email.com',
      firstName: 'Samuel',
      lastName: 'Aka',
      phone: '06 90 12 34 56',
      location: 'Bordeaux',
      chapterRole: 'Président',
      description: 'Expert-comptable et commissaire aux comptes. Cabinet indépendant au service des TPE/PME. Création d\'entreprise, bilan, fiscalité.',
      chapterIndex: 3, // Bordeaux Centre
      sectorIndex: 4,  // Finance & Assurance
      services: [
        { name: 'Comptabilité', description: 'Tenue comptable, bilan, déclarations fiscales' },
        { name: 'Création d\'entreprise', description: 'Accompagnement juridique et fiscal' },
        { name: 'Audit', description: 'Commissariat aux comptes et audit contractuel' },
      ],
    },
    {
      email: 'fatou.sow@email.com',
      firstName: 'Fatou',
      lastName: 'Sow',
      phone: '06 01 23 45 67',
      location: 'Toulouse',
      chapterRole: 'Vice-présidente',
      description: 'Développeuse mobile et UI/UX designer. Création d\'applications iOS et Android. Passionnée par l\'accessibilité et le design inclusif.',
      chapterIndex: 4, // Toulouse Capitole
      sectorIndex: 2,  // Informatique & Tech
      services: [
        { name: 'Développement mobile', description: 'Applications iOS et Android (React Native, Flutter)' },
        { name: 'UI/UX Design', description: 'Maquettes, prototypes et design systems' },
      ],
    },
    {
      email: 'philippe.kouame@email.com',
      firstName: 'Philippe',
      lastName: 'Kouamé',
      phone: '06 11 22 33 44',
      location: 'Paris 16e',
      chapterRole: 'Vice-président',
      description: 'Entrepreneur dans le BTP. Rénovation d\'appartements et maisons en Île-de-France. Devis gratuit, travaux clé en main.',
      chapterIndex: 0, // Paris Centre
      sectorIndex: 0,  // Bâtiment & Construction
      services: [
        { name: 'Rénovation complète', description: 'Appartements et maisons clé en main' },
        { name: 'Plomberie & Électricité', description: 'Installation et dépannage' },
        { name: 'Peinture & Revêtements', description: 'Peinture intérieure/extérieure, parquet, carrelage' },
      ],
    },
    {
      email: 'ruth.mensah@email.com',
      firstName: 'Ruth',
      lastName: 'Mensah',
      phone: '06 22 33 44 55',
      whatsapp: '+33622334455',
      location: 'Lyon 2e',
      chapterRole: 'Présidente',
      description: 'Kinésithérapeute et ostéopathe. Cabinet privé spécialisé dans les douleurs chroniques, la rééducation sportive et le bien-être périnatal.',
      chapterIndex: 1, // Lyon Presqu'ile
      sectorIndex: 3,  // Santé & Bien-être
      services: [
        { name: 'Kinésithérapie', description: 'Rééducation fonctionnelle et sportive' },
        { name: 'Ostéopathie', description: 'Traitement des douleurs musculo-squelettiques' },
        { name: 'Bien-être périnatal', description: 'Accompagnement grossesse et post-partum' },
      ],
    },
  ];

  const memberPassword = await bcrypt.hash('membre123', 10);

  for (const m of membersData) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        email: m.email,
        password: memberPassword,
        role: 'MEMBER',
      },
    });

    await prisma.member.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phone,
        whatsapp: m.whatsapp || null,
        location: m.location,
        description: m.description,
        chapterRole: m.chapterRole || null,
        isValidated: true,
        chapterId: chapters[m.chapterIndex].id,
        sectorId: sectors[m.sectorIndex].id,
        services: {
          create: m.services,
        },
      },
    });
  }

  // Avis de test (quelques membres notent d'autres membres)
  const allMembers = await prisma.member.findMany({ include: { user: true } });
  const reviewsData = [
    { authorIndex: 0, memberIndex: 1, rating: 5, comment: 'Excellent travail de décoration pour notre bureau. Marie a su comprendre nos besoins et le résultat est magnifique !' },
    { authorIndex: 1, memberIndex: 0, rating: 4, comment: 'Jean a développé notre site web rapidement et avec professionnalisme. Très réactif.' },
    { authorIndex: 2, memberIndex: 0, rating: 5, comment: 'Très bon développeur, je recommande vivement. Application livrée dans les délais.' },
    { authorIndex: 3, memberIndex: 2, rating: 4, comment: 'Paul m\'a trouvé une assurance professionnelle au meilleur prix. Bon conseil.' },
    { authorIndex: 4, memberIndex: 5, rating: 5, comment: 'Le traiteur d\'Amina a été la star de notre séminaire ! Cuisine délicieuse et service impeccable.' },
    { authorIndex: 5, memberIndex: 4, rating: 5, comment: 'Formation en management très enrichissante. David est un excellent pédagogue.' },
    { authorIndex: 6, memberIndex: 7, rating: 4, comment: 'Produits cosmétiques de grande qualité. Ma clientèle adore.' },
    { authorIndex: 7, memberIndex: 6, rating: 5, comment: 'Déménagement effectué avec soin et ponctualité. Équipe très professionnelle.' },
    { authorIndex: 0, memberIndex: 10, rating: 4, comment: 'Philippe a rénové mon appartement avec soin. Bon rapport qualité-prix.' },
    { authorIndex: 1, memberIndex: 11, rating: 5, comment: 'Ruth est une kinésithérapeute exceptionnelle. Mes douleurs dorsales ont disparu en quelques séances.' },
    { authorIndex: 3, memberIndex: 8, rating: 5, comment: 'Samuel m\'a accompagnée dans la création de mon entreprise. Conseils précieux et grande disponibilité.' },
    { authorIndex: 9, memberIndex: 0, rating: 4, comment: 'Bonne collaboration sur un projet mobile. Jean maîtrise bien le fullstack.' },
    { authorIndex: 10, memberIndex: 5, rating: 5, comment: 'Buffet africain pour notre événement familial, tout le monde a adoré !' },
    { authorIndex: 11, memberIndex: 3, rating: 4, comment: 'Sarah m\'a aidée à retrouver un bon équilibre alimentaire. Merci !' },
    { authorIndex: 8, memberIndex: 9, rating: 5, comment: 'Fatou a conçu une application mobile superbe pour notre cabinet. UX impeccable.' },
  ];

  for (const r of reviewsData) {
    if (allMembers[r.authorIndex] && allMembers[r.memberIndex]) {
      try {
        await prisma.review.upsert({
          where: {
            authorId_memberId: {
              authorId: allMembers[r.authorIndex].userId,
              memberId: allMembers[r.memberIndex].id,
            },
          },
          update: {},
          create: {
            authorId: allMembers[r.authorIndex].userId,
            memberId: allMembers[r.memberIndex].id,
            rating: r.rating,
            comment: r.comment,
          },
        });
      } catch {
        // skip if duplicate
      }
    }
  }

  // Mise à jour des moyennes de notes
  for (const member of allMembers) {
    const result = await prisma.review.aggregate({
      where: { memberId: member.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.member.update({
      where: { id: member.id },
      data: {
        avgRating: result._avg.rating || 0,
        reviewCount: result._count.rating,
      },
    });
  }

  console.log('Seed completed');
  console.log(`  ${chapters.length} chapters created`);
  console.log(`  ${sectors.length} sectors created`);
  console.log(`  ${membersData.length} members created`);
  console.log(`  ${reviewsData.length} reviews created`);
  console.log('  Admin: admin@fgbmfi.org / admin123');
  console.log('  Members password: membre123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
