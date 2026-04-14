# Annuaire FGBMFI

Application d'annuaire professionnel pour le **Full Gospel Business Men's Fellowship International (FGBMFI)**. Permet de valoriser les membres de la communauté, faciliter les connexions professionnelles et promouvoir les services proposés grâce à un système de notation et d'avis.

## Stack technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Base de données** | PostgreSQL |
| **Auth** | JWT (access + refresh tokens), bcrypt |
| **Upload** | Multer + Sharp (compression WebP) |
| **Containerisation** | Docker, docker-compose |
| **Déploiement** | Frontend sur Vercel, Backend sur Railway/Render |

## Fonctionnalités

### Annuaire public
- Fiches profil des membres (photo, coordonnées, secteur, chapitre, services)
- Recherche avec debounce (nom, service, description)
- Filtres par chapitre, secteur, note minimale, localisation
- Pagination avancée

### Système d'avis
- Notation sur 5 étoiles
- Commentaires par les membres authentifiés
- Calcul automatique de la moyenne et du nombre d'avis
- Protection contre l'auto-notation et les doublons

### Classements
- Top membres par secteur d'activité
- Top membres par chapitre

### Espace membre
- Inscription avec sélection du chapitre
- Création et modification du profil
- Upload de photo (compression automatique en WebP 800x800)
- Gestion des services proposés (ajout/suppression)

### Back-office admin
- Dashboard avec statistiques
- Gestion des membres (liste complète, filtres, ajout via slide-in, validation, désactivation, suppression)
- Modération des avis
- Gestion des chapitres, secteurs et postes de chapitre

### Sécurité et performance
- Rate limiting (auth : 20 req/15min, API : 100 req/min)
- Compression d'images côté serveur (Sharp)
- Lazy loading des pages admin
- Debounce sur la recherche
- Skeleton loaders
- Logger structuré (Pino)

## Structure du projet

```
annuaire_fgbmfi/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── index.ts
│       ├── config/         # env, logger
│       ├── middlewares/     # auth, roles, upload, rateLimiter, errorHandler
│       ├── routes/          # auth, member, review, chapter, sector, chapterRole, admin
│       ├── controllers/
│       ├── services/
│       └── utils/           # validation (Zod)
└── frontend/
    ├── Dockerfile
    ├── vercel.json
    ├── package.json
    └── src/
        ├── App.tsx
        ├── api/             # client Axios
        ├── config/          # hero banner
        ├── context/         # AuthContext
        ├── hooks/           # useAuth, useMembers, useDebounce
        ├── components/      # Navbar, MemberCard, StarRating, Pagination, Skeleton...
        └── pages/           # Home, Login, Register, MemberProfile, EditProfile, Rankings, admin/
```

## Installation

### Avec Docker

```bash
docker-compose up --build
```

L'application sera disponible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:3001
- PostgreSQL : localhost:5432

### Sans Docker

**Prérequis** : Node.js 20+, PostgreSQL

```bash
# Backend
cd backend
npm install
cp ../.env.example ../.env  # adapter les variables
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## Variables d'environnement

### Backend (`.env`)

| Variable | Description | Défaut |
|---|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL | — |
| `JWT_SECRET` | Clé secrète pour les access tokens | `dev-secret` |
| `JWT_REFRESH_SECRET` | Clé secrète pour les refresh tokens | `dev-refresh-secret` |
| `PORT` | Port du serveur | `3001` |
| `CORS_ORIGIN` | Domaines autorisés (séparés par `,`) | `*` |
| `LOG_LEVEL` | Niveau de log (info, debug, warn, error) | `info` |

### Frontend (`.env`)

| Variable | Description | Défaut |
|---|---|---|
| `VITE_API_URL` | URL de l'API backend | `/api` (proxy dev) |

## Données de test

Le seed crée automatiquement :
- **1 admin** : `admin@fgbmfi.org` / `admin123`
- **12 membres** avec profils complets, services et postes de chapitre
- **15 avis** croisés entre membres
- **5 chapitres**, **8 secteurs**, **13 postes de chapitre**

Mot de passe des membres de test : `membre123`

## Déploiement

### Frontend sur Vercel

1. Importer le repo sur Vercel
2. Root directory : `frontend`
3. Framework : Vite
4. Ajouter la variable d'environnement `VITE_API_URL` pointant vers le backend

### Backend sur Railway / Render

1. Créer un service depuis le repo
2. Root directory : `backend`
3. Ajouter les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`)
4. Le Dockerfile exécute automatiquement les migrations au démarrage

## API

### Endpoints publics

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `POST` | `/api/auth/refresh` | Rafraîchir le token |
| `GET` | `/api/members` | Liste des membres (filtres, pagination) |
| `GET` | `/api/members/:id` | Détail d'un membre |
| `GET` | `/api/members/:id/reviews` | Avis d'un membre |
| `GET` | `/api/chapters` | Liste des chapitres |
| `GET` | `/api/sectors` | Liste des secteurs |
| `GET` | `/api/chapter-roles` | Liste des postes |

### Endpoints authentifiés

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/members/me` | Mon profil |
| `POST` | `/api/members` | Créer mon profil |
| `PUT` | `/api/members/:id` | Modifier mon profil |
| `POST` | `/api/members/:id/photo` | Upload photo |
| `POST` | `/api/members/:id/reviews` | Poster un avis |
| `DELETE` | `/api/reviews/:id` | Supprimer mon avis |

### Endpoints admin

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/admin/members` | Tous les membres |
| `POST` | `/api/admin/members` | Créer un membre |
| `PUT` | `/api/admin/members/:id/validate` | Valider un membre |
| `PUT` | `/api/admin/members/:id/invalidate` | Désactiver un membre |
| `DELETE` | `/api/admin/members/:id` | Supprimer un membre |
| `GET` | `/api/admin/reviews` | Tous les avis |
| `DELETE` | `/api/admin/reviews/:id` | Supprimer un avis |
| `GET` | `/api/admin/stats` | Statistiques |
| `GET` | `/api/admin/rankings` | Classements |

## Licence

Projet privé — FGBMFI
