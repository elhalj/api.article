````markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Backend d'Articles

Ce projet est un backend pour la gestion d'articles. Il permet de créer, lire, mettre à jour et supprimer des articles, ainsi que de gérer les utilisateurs et les authentifications.

## Fonctionnalités

- **Gestion des articles** :

  - Créer, lire, mettre à jour et supprimer des articles.
  - Rechercher des articles par catégorie, auteur, tags ou statut.
  - Pagination et tri des résultats.

- **Authentification** :

  - Inscription et connexion des utilisateurs.
  - Protection des routes avec JWT.
  - Gestion des rôles (utilisateur, admin).

- **Autres fonctionnalités** :
  - Validation des données.
  - Gestion des erreurs centralisée.
  - Journalisation des requêtes.

## Technologies utilisées

- **Backend** :

  - Node.js
  - Express.js
  - MongoDB (avec Mongoose)
  - JWT (JSON Web Tokens) pour l'authentification
  - Bcrypt pour le hachage des mots de passe

- **Outils** :
  - ESLint et Prettier pour la qualité du code
  - Postman pour tester les API

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/backend-articles.git
   cd backend-articles
   ```
````

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :

   - Créez un fichier `.env` à la racine du projet.
   - Ajoutez les variables suivantes :
     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/nom-de-votre-base-de-donnees
     JWT_SECRET=votre-secret-jwt
     NODE_ENV=development
     ```

4. Démarrez le serveur :

   ```bash
   npm start
   ```

5. Accédez à l'API :
   - Le serveur est accessible à l'adresse : `http://localhost:3000`

## Routes de l'API

### Articles

- **GET /api/article/toutArticles** : Récupérer tous les articles (public).
- **GET /api/article/chercherArticle** : Rechercher article (public)
- **GET /api/article/mesArticles** : Récupérer les articles de l'utilisateur connecté.
- **POST /api/article/ajouterArticle** : Créer un nouvel article.
- **PUT /api/article/:id** : Mettre à jour un article.
- **DELETE /api/article/:id** : Supprimer un article.

### Authentification

- **POST /api/signUp** : Inscription d'un nouvel utilisateur.
- **POST /api/login** : Connexion d'un utilisateur.
- **POST /api/logout** : Deconnexion utilisateur.
- **GET /api/checkAuth** : Verification si l'utilisateur est connecter.
- **GET /api/getUser** : Recuperer tous les utilisateur (Admin).
- **DELETE /api/:id** : Supprimer utilisateur (Admin)
- **GET /api/:id** : Recuperer information personnel (Prive).
- **
  -\*\***

### Exemples de requêtes

#### Créer un article

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{
    "title": "Mon premier article",
    "content": "Contenu de l'article",
    "category": "Technologie",
    "tags": ["nodejs", "backend"]
  }'
```

#### Rechercher des articles

```bash
curl -X GET "http://localhost:3000/api/articles?category=Technologie&page=1&limit=10"
```

## Structure du projet

```
backend-articles/
├── config/           # Configuration (base de données, etc.)
├── controllers/      # Contrôleurs pour gérer les requêtes
├── models/           # Modèles Mongoose
├── routes/           # Routes de l'API
├── middleware/       # Middleware personnalisé
├── utils/            # Utilitaires (gestion des erreurs, etc.)
├── .env.example      # Exemple de fichier .env
├── app.js            # Point d'entrée de l'application
└── README.md         # Documentation
```

## Contribuer

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`).
3. Committez vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrez une Pull Request.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```

---


```
