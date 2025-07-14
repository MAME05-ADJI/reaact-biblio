import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Star, 
  Eye, 
  User, 
  Calendar, 
  BookOpen, 
  FileText,
  MessageCircle,
  Tag,
  Share2
} from 'lucide-react';

const DocumentDetail = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    fetchDocument();
    fetchComments();
    checkFavorite();
    checkUserRating();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/api/documents/${id}`);
      setDocument(response.data);
      // Incrémenter les vues
      await axios.post(`http://localhost:2000/api/documents/${id}/view`);
    } catch (error) {
      console.error('Erreur lors du chargement du document:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/api/comments/document/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/api/favorites/check/${id}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const checkUserRating = async () => {
    try {
      const response = await axios.get(`http://localhost:2000/api/ratings/user/${id}`);
      setUserRating(response.data.rating || 0);
    } catch (error) {
      console.error('Erreur lors de la vérification de la note:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:2000/api/favorites/${id}`);
      } else {
        await axios.post('http://localhost:2000/api/favorites', { documentId: id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  const submitRating = async (rating) => {
    try {
      await axios.post('http://localhost:2000/api/ratings', {
        documentId: id,
        note: rating
      });
      setUserRating(rating);
      // Recharger le document pour mettre à jour la note moyenne
      fetchDocument();
    } catch (error) {
      console.error('Erreur lors de la soumission de la note:', error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:2000/api/comments', {
        documentId: id,
        contenu: newComment,
        note: newRating
      });
      setNewComment('');
      setNewRating(0);
      fetchComments();
    } catch (error) {
      console.error('Erreur lors de la soumission du commentaire:', error);
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Document non trouvé</h3>
        <Link
          to="/etudiant/search"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Retour à la recherche
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link
          to="/etudiant/search"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Link>
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{document.titre}</h1>
            <div className="flex items-center text-lg text-gray-600 mb-4">
              <User className="w-5 h-5 mr-2" />
              {document.auteur}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
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
                {new Date(document.datePublication || document.dateAjout).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {document.vues || 0} vues
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-3 md:ml-6">
            <button
              onClick={toggleFavorite}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                isFavorite
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Note moyenne:</span>
              <div className="flex space-x-1">
                {renderStars(Math.round(document.notemoyenne || 0))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({document.notemoyenne?.toFixed(1) || 0}/5)
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Votre note:</span>
              <div className="flex space-x-1">
                {renderStars(userRating, true, submitRating)}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{document.description}</p>
          </div>
        )}

        {/* Métadonnées */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Informations détaillées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Langue:</span>
              <span className="text-sm text-gray-900 ml-2">{document.langue}</span>
            </div>
            {document.nombrePages && (
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre de pages:</span>
                <span className="text-sm text-gray-900 ml-2">{document.nombrePages}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Date d'ajout:</span>
              <span className="text-sm text-gray-900 ml-2">
                {new Date(document.dateAjout).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Format:</span>
              <span className="text-sm text-gray-900 ml-2">PDF</span>
            </div>
          </div>
        </div>

        {/* Mots-clés */}
        {document.motsCles && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Mots-clés
            </h3>
            <div className="flex flex-wrap gap-2">
              {document.motsCles.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Commentaires */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Commentaires ({comments.length})
        </h3>

        {/* Formulaire de commentaire */}
        <form onSubmit={submitComment} className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Partagez votre avis sur ce document..."
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Note (optionnelle):</span>
              <div className="flex space-x-1">
                {renderStars(newRating, true, setNewRating)}
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Publier
            </button>
          </div>
        </form>

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {comment.etudiant.prenom.charAt(0)}{comment.etudiant.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {comment.etudiant.prenom} {comment.etudiant.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.dateCommentaire).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                {comment.note && (
                  <div className="flex items-center space-x-1">
                    {renderStars(comment.note)}
                  </div>
                )}
              </div>
              <p className="text-gray-700">{comment.contenu}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDetail;