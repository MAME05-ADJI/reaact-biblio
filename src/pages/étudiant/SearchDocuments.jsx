import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Download, Heart, Star, BookOpen, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLangue, setFilterLangue] = useState('all');
  const [sortBy, setSortBy] = useState('pertinence');
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchDocuments();
    fetchFavorites();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:2000/api/documents/public');
      setDocuments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:2000/api/favorites');
      setFavorites(new Set(response.data.map(fav => fav.documentId)));
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  };

  const toggleFavorite = async (documentId) => {
    try {
      if (favorites.has(documentId)) {
        await axios.delete(`http://localhost:2000/api/favorites/${documentId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });
      } else {
        await axios.post('http://localhost:2000/api/favorites', { documentId });
        setFavorites(prev => new Set(prev).add(documentId));
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.motsCles?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesLangue = filterLangue === 'all' || doc.langue === filterLangue;
    return matchesSearch && matchesType && matchesLangue;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case 'titre':
        return a.titre.localeCompare(b.titre);
      case 'auteur':
        return a.auteur.localeCompare(b.auteur);
      case 'date':
        return new Date(b.dateAjout) - new Date(a.dateAjout);
      case 'popularite':
        return (b.vues || 0) - (a.vues || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rechercher des Documents</h1>
        <p className="text-gray-600">Explorez notre collection de documents académiques</p>
      </div>

      {/* Barre de recherche principale */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, mots-clés..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="memoire">Mémoire</option>
              <option value="these">Thèse</option>
              <option value="article">Article</option>
              <option value="livre">Livre</option>
            </select>
          </div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterLangue}
            onChange={(e) => setFilterLangue(e.target.value)}
          >
            <option value="all">Toutes les langues</option>
            <option value="francais">Français</option>
            <option value="anglais">Anglais</option>
            <option value="espagnol">Espagnol</option>
          </select>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="pertinence">Pertinence</option>
            <option value="date">Plus récent</option>
            <option value="titre">Titre A-Z</option>
            <option value="auteur">Auteur A-Z</option>
            <option value="popularite">Plus populaire</option>
          </select>
          <div className="text-center">
            <span className="text-sm text-gray-500">
              {sortedDocuments.length} résultat{sortedDocuments.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocuments.map((document) => (
          <div
            key={document.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {document.titre}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    {document.auteur}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(document.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.has(document.id)
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.has(document.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    document.type === 'memoire' ? 'bg-blue-100 text-blue-800' :
                    document.type === 'these' ? 'bg-purple-100 text-purple-800' :
                    document.type === 'article' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(document.dateAjout).getFullYear()}
                </div>
              </div>

              {document.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {document.description}
                </p>
              )}

              {document.motsCles && (
                <div className="flex items-center mb-4">
                  <Tag className="w-4 h-4 mr-1 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {document.motsCles.split(',').slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Eye className="w-4 h-4 mr-1" />
                  {document.vues || 0} vues
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-1" />
                    {document.notemoyenne || 0}/5
                  </div>
                  <div className="flex space-x-1">
                    <Link
                      to={`/etudiant/document/${document.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedDocuments.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default SearchDocuments;