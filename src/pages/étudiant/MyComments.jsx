import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Star, Edit, Trash2, BookOpen, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:2000/api/comments/my-comments');
      setComments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      try {
        await axios.delete(`http://localhost:2000/api/comments/${commentId}`);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error('Erreur lors de la suppression du commentaire:', error);
      }
    }
  };

  const updateComment = async (commentId) => {
    try {
      await axios.put(`http://localhost:2000/api/comments/${commentId}`, {
        contenu: editText
      });
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, contenu: editText }
          : comment
      ));
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Erreur lors de la modification du commentaire:', error);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.contenu);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Commentaires</h1>
        <p className="text-gray-600">Gérez vos commentaires et évaluations</p>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire pour le moment</h3>
          <p className="text-gray-500 mb-4">Partagez vos impressions sur les documents que vous consultez</p>
          <Link
            to="/etudiant/search"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Parcourir les documents
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link
                    to={`/etudiant/document/${comment.documentId}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {comment.document.titre}
                  </Link>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4 mr-1" />
                    {comment.document.auteur}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(comment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {comment.note && (
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm text-gray-600">Ma note:</span>
                  <div className="flex space-x-1">
                    {renderStars(comment.note)}
                  </div>
                  <span className="text-sm text-gray-600">({comment.note}/5)</span>
                </div>
              )}

              {editingComment === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateComment(comment.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingComment(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{comment.contenu}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Commenté le {new Date(comment.dateCommentaire).toLocaleDateString('fr-FR')}
                </div>
                <Link
                  to={`/etudiant/document/${comment.documentId}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Voir le document
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComments;