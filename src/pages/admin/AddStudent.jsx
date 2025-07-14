import React, { useState } from 'react';
import { Save, X, User, Mail, BookOpen } from 'lucide-react';

const AddStudentPopup = ({ isOpen, onClose, onStudentAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    filiere: '',
    role: 'ETUDIANT' // Rôle par défaut
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Appel API réel vers le backend
      const response = await fetch('http://localhost:2000/api/etudiants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        filiere: ''
      });
      
      // Notifier le composant parent avec les données reçues du serveur
      if (onStudentAdded) {
        onStudentAdded(data);
      }
      
      // Fermer le popup
      onClose();
      
      // Message de succès
      alert('Étudiant ajouté avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', error);
      
      // Gestion des erreurs plus détaillée
      if (error.message.includes('Failed to fetch')) {
        alert('Erreur de connexion au serveur. Vérifiez que le serveur est démarré.');
      } else if (error.message.includes('400')) {
        alert('Données invalides. Vérifiez tous les champs.');
      } else if (error.message.includes('409')) {
        alert('Cet email est déjà utilisé.');
      } else {
        alert('Erreur lors de l\'ajout de l\'étudiant : ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ajouter un Étudiant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Informations personnelles
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom de famille"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                  />
                </div>
              </div>

              {/* Informations académiques */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Informations académiques
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filière *
                  </label>
                  <input
                    type="text"
                    name="filiere"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.filiere}
                    onChange={handleChange}
                    placeholder="Ex: IJ, Informatique, Mathématiques..."
                  />
                </div>
              </div>

              {/* Informations de connexion */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Informations de connexion
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      name="motDePasse"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      placeholder="Au moins 8 caractères"
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Ajout en cours...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentPopup;