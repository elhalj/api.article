import { Article } from "../models/Article.model.js";

//ajouter article
export const addArticle = async (req, res) => {
  const {
    title,
    description,
    author,
    category,
    tags,
    content,
    imageUrl,
    statut,
    slug,
  } = req.body;
  try {
    if (!title || !description || !author || !category || !content) {
      res.status(401).json({
        message: "Vous avez oublier l'un des champs les plus important",
      });
    }
    const add = await Article.create({
      title,
      description,
      author: req.user._id,
      category,
      tags,
      content,
      imageUrl,
      statut,
      slug,
    });

    if (add) {
      await add.save();
      res.status(201).json({
        _id: add._id,
        title: add.title,
        author: add.author,
        category: add.category,
      });
      console.log("Ajouter avec succes", add._id, add.title);
    } else {
      res.status(401).json({ message: "Echec lors de l'ajout" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid, verifier server", error });
    console.log("Invalid, probleme server", error.message);
  }
};

//public
//afficher tous les articles
// Privee
//recuperer les arcticles de l'utilisateur connecter
export const getUserArticle = async (req, res) => {
  try {
    const article = await Article.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: "ERREUR, verifier server" });
    console.log("ERREUR, verifier server", error.message);
  }
};

// Privee
//recuperer les arcticles de l'utilisateur connecter
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    status: 'error',
    message: error.message || 'Erreur serveur'
  });
};

// article.controller.js
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().lean();

    // Corriger le format des dates
    const formattedArticles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt).toISOString(),
      updatedAt: new Date(article.updatedAt).toISOString()
    }));

    // Structure de réponse standardisée
    res.status(200).json({
      status: "success",
      results: formattedArticles.length,
      data: {
        articles: formattedArticles
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Erreur serveur"
    });
  }
};

//public
//chercher article par [category, auteur, tags ou status]
export const searchArticle = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Limiter à 100 max
    const skip = (page - 1) * limit;

    // Tri sécurisé
    const allowedSortFields = ["createdAt", "title"];
    const sortBy = allowedSortFields.includes(
      req.query.sortBy?.replace(/^-/, "")
    )
      ? req.query.sortBy
      : "-createdAt";

    // Filtres
    const { category, author, tags, statut, q } = req.query;
    const filter = {};

    // Validation catégorie
    const validCategories = ["Technologie", "Santé", "Éducation", "Voyage"];
    if (category) {
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Catégorie invalide" });
      }
      filter.category = category;
    }

    // Filtres texte
    if (author) filter.author = { $regex: author, $options: "i" };
    if (q) filter.$text = { $search: q };
    if (tags) filter.tags = { $in: tags.split(",").slice(0, 5) }; // Limite à 5 tags
    if (statut) filter.statut = { $in: statut.split(",") };

    // Requête
    const [results, total] = await Promise.all([
      Article.find(filter).skip(skip).limit(limit).sort(sortBy).lean(),
      Article.countDocuments(filter),
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche",
      ...(process.env.NODE_ENV === "development" && { debug: error.message }),
    });
  }
};

//Prive
//supprimer article
export const deleteArcticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(401).json({ message: "Article non trouver" });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Desole, vous n'etes pas autoriser a supprimer l'article",
      });
    }

    await article.deleteOne({ _id: req.params.id });
    res
      .status(201)
      .json({ message: "supprimer avec succes", article: article });
    console.log("Supprimer avec succes", article);
  } catch (error) {
    res.status(500).json({ message: "ERREUR, verifier server" });
    console.log("ERREUR, verifier server", error.message);
  }
};

//Priver
//Modifier article
export const updateArticle = async (req, res) => {
  try {
    // 1. Trouver l'article
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // 2. Vérifier l'auteur
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // 3. Valider le statut (si fourni)
    const validStatuts = ["draft", "published", "archived"];
    if (req.body.statut && !validStatuts.includes(req.body.statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    // 4. Mettre à jour l'article
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        statut: req.body.statut || article.statut,
      },
      { new: true, runValidators: true } // Retourne l'article mis à jour et valide les champs
    );

    // 5. Réponse
    res.status(200).json({
      message: "Article modifié avec succès",
      article: updatedArticle,
    });
    console.log(updateArticle.title);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article :", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};
