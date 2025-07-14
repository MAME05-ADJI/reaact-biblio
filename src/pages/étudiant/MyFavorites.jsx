import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Eye, Download, Trash2, BookOpen, User, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:2000/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (documentId) => {
    try {
      await axios.delete(`http://localhost:2000/api/favorites/${documentId}`);
      setFavorites(favorites.filter(fav => fav.documentId !== documentId));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Favoris</h1>
        <p className="text-gray-600">Retrouvez vos documents préférés</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-500 mb-4">Ajoutez des documents à vos favoris pour les retrouver facilement</p>
          <Link
            to="/etudiant/search"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Parcourir les documents
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.documentId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {favorite.document.titre}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      {favorite.document.auteur}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.documentId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      favorite.document.type === 'memoire' ? 'bg-blue-100 text-blue-800' :
                      favorite.document.type === 'these' ? 'bg-purple-100 text-purple-800' :
                      favorite.document.type === 'article' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {favorite.document.type}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(favorite.document.dateAjout).getFullYear()}
                  </div>
                </div>

                {favorite.document.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {favorite.document.description}
                  </p>
                )}

                {favorite.document.motsCles && (
                  <div className="flex items-center mb-4">
                    <Tag className="w-4 h-4 mr-1 text-gray-400" />
                    <div className="flex flex-wrap gap-1">
                      {favorite.document.motsCles.split(',').slice(0, 3).map((tag, index) => (
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
                  <div className="text-sm text-gray-500">
                    Ajouté le {new Date(favorite.dateAjout).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex space-x-1">
                    <Link
                      to={`/etudiant/document/${favorite.documentId}`}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;