import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberProfile from './pages/MemberProfile';
import EditProfile from './pages/EditProfile';
import Rankings from './pages/Rankings';
import NotFound from './pages/NotFound';

// Lazy load admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminMembers = lazy(() => import('./pages/admin/Members'));
const AdminReviews = lazy(() => import('./pages/admin/Reviews'));
const AdminChapters = lazy(() => import('./pages/admin/Chapters'));
const AdminSectors = lazy(() => import('./pages/admin/Sectors'));
const AdminChapterRoles = lazy(() => import('./pages/admin/ChapterRoles'));

function AdminLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-dark-400">Chargement...</div>}>
      {children}
    </Suspense>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/members/:id" element={<MemberProfile />} />
        <Route path="/rankings" element={<Rankings />} />

        <Route path="/profile/edit" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminLoader><Dashboard /></AdminLoader></ProtectedRoute>
        } />
        <Route path="/admin/members" element={
          <ProtectedRoute adminOnly><AdminLoader><AdminMembers /></AdminLoader></ProtectedRoute>
        } />
        <Route path="/admin/reviews" element={
          <ProtectedRoute adminOnly><AdminLoader><AdminReviews /></AdminLoader></ProtectedRoute>
        } />
        <Route path="/admin/chapters" element={
          <ProtectedRoute adminOnly><AdminLoader><AdminChapters /></AdminLoader></ProtectedRoute>
        } />
        <Route path="/admin/sectors" element={
          <ProtectedRoute adminOnly><AdminLoader><AdminSectors /></AdminLoader></ProtectedRoute>
        } />
        <Route path="/admin/chapter-roles" element={
          <ProtectedRoute adminOnly><AdminLoader><AdminChapterRoles /></AdminLoader></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
