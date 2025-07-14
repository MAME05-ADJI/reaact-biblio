import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import UnifiedLayout from './layouts/UnifiedLayout';
import DocumentsList from './pages/admin/DocumentsList';
import AddDocument from './pages/admin/AddDocument';
import StudentsList from './pages/admin/StudentsList';
import CategoriesManager from './pages/admin/CategoriesManager';
import AddStudent from './pages/admin/AddStudent';
import SearchDocuments from './pages/étudiant/SearchDocuments';
import MyFavorites from './pages/étudiant/MyFavorites';
import MyComments from './pages/étudiant/MyComments';
import DocumentDetail from './pages/étudiant/DocumentDetail';
import LoadingSpinner from './components/LoadingSpinner';
import  Livres  from './pages/admin/Livre'; // Import Livres component

// Composant placeholder pour les pages en développement
const PlaceholderPage = ({ title, description }) => (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
            <p className="text-gray-600 mb-4">{description || "Cette page est en cours de développement."}</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500">URL actuelle: {window.location.pathname}</p>
            </div>
            <div className="flex justify-center space-x-3">
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Retour
                </button>
                <button
                    onClick={() => (window.location.href = "/")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Accueil
                </button>
            </div>
        </div>
    </div>
);

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<PlaceholderPage title="Accès Interdit" description="Vous n'avez pas les autorisations nécessaires pour accéder à cette page." />} />
      {/* Routes Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <UnifiedLayout>
            <Routes>
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="documents" element={<DocumentsList />} />
              <Route path="documents/add" element={<AddDocument />} />
              <Route path="etudiants" element={<StudentsList />} />
              <Route path="etudiants/add" element={<AddStudent />} />
              <Route path="stats" element={<PlaceholderPage title="Statistiques" description="Tableau de bord des statistiques de la bibliothèque" />} />
              <Route path="emprunts" element={<PlaceholderPage title="Gestion des Emprunts" description="Suivi et gestion des emprunts de livres" />} />
              <Route path="livres" element={<Livres />} />
              <Route path="" element={<Navigate to="documents" replace />} />
            </Routes>
          </UnifiedLayout>
        </ProtectedRoute>
      } />
      
      {/* Routes Étudiant */}
      <Route path="/etudiant/*" element={
        <ProtectedRoute allowedRoles={['ETUDIANT']}>
          <UnifiedLayout>
            <Routes>
              <Route path="search" element={<SearchDocuments />} />
              <Route path="favorites" element={<MyFavorites />} />
              <Route path="comments" element={<MyComments />} />
              <Route path="document/:id" element={<DocumentDetail />} />
              <Route path="emprunts" element={<PlaceholderPage title="Mes Emprunts" description="Historique et suivi de vos emprunts" />} />
              <Route path="evaluations" element={<PlaceholderPage title="Mes Évaluations" description="Évaluations et notes des documents" />} />
              <Route path="" element={<Navigate to="search" replace />} />
            </Routes>
          </UnifiedLayout>
        </ProtectedRoute>
      } />
      
      {/* Routes Enseignant */}
      <Route path="/enseignant/*" element={
        <ProtectedRoute allowedRoles={['enseignant']}>
          <UnifiedLayout>
            <Routes>
              <Route path="cours" element={<PlaceholderPage title="Mes Cours" description="Gestion de vos cours et matières" />} />
              <Route path="etudiants" element={<PlaceholderPage title="Mes Étudiants" description="Liste et suivi de vos étudiants" />} />
              <Route path="ressources" element={<PlaceholderPage title="Mes Ressources" description="Ressources pédagogiques et documents" />} />
              <Route path="publier" element={<PlaceholderPage title="Publier du Contenu" description="Publier des ressources et documents" />} />
              <Route path="evaluations" element={<PlaceholderPage title="Évaluations" description="Système d'évaluation des étudiants" />} />
              <Route path="planning" element={<PlaceholderPage title="Planning" description="Gestion du planning des cours" />} />
              <Route path="" element={<Navigate to="cours" replace />} />
            </Routes>
          </UnifiedLayout>
        </ProtectedRoute>
      } />
      
      {/* Routes Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UnifiedLayout>
            <Routes>
              <Route path="users" element={<PlaceholderPage title="Gestion des Utilisateurs" description="Administration des comptes utilisateurs" />} />
              <Route path="documents" element={<PlaceholderPage title="Tous les Documents" description="Gestion globale des documents" />} />
              <Route path="stats" element={<PlaceholderPage title="Statistiques Globales" description="Tableaux de bord et analytics" />} />
              <Route path="config" element={<PlaceholderPage title="Configuration" description="Paramètres système et configuration" />} />
              <Route path="logs" element={<PlaceholderPage title="Logs Système" description="Journaux et historique du système" />} />
              <Route path="" element={<Navigate to="users" replace />} />
            </Routes>
          </UnifiedLayout>
        </ProtectedRoute>
      } />
      
      {/* Page d'accueil */}
      <Route path="/" element={
        user ? (
          <UnifiedLayout>
            <PlaceholderPage 
              title={`Bienvenue, ${user.nom || 'Utilisateur'}`} 
              description={`Tableau de bord ${user.role === 'bibliothecaire' ? 'bibliothécaire' : user.role === 'ETUDIANT' ? 'étudiant' : user.role}`} 
            />
          </UnifiedLayout>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      
      {/* Page d'accès non autorisé */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
            <p className="text-gray-600 mb-4">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;