import React from 'react';

const books = [
  {
    id: 1,
    titre: 'Le Petit Prince',
    auteur: 'Antoine de Saint-Exupéry',
    annee: 1943,
    couverture: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/8f/Le_Petit_Prince.jpg/220px-Le_Petit_Prince.jpg',
  },
  {
    id: 2,
    titre: 'L’Alchimiste',
    auteur: 'Paulo Coelho',
    annee: 1988,
    couverture: 'https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL.jpg',
  },
  {
    id: 3,
    titre: 'Les Misérables',
    auteur: 'Victor Hugo',
    annee: 1862,
    couverture: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Jean_Valjean_-_Les_Mis%C3%A9rables_-_Victor_Hugo.jpg',
  },
];

const Livres = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Liste de Livres</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={book.couverture}
              alt={book.titre}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{book.titre}</h2>
              <p className="text-gray-600">Auteur : {book.auteur}</p>
              <p className="text-gray-500 text-sm">Année : {book.annee}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Livres;