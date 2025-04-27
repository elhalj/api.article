import express from "express";
import {
  addArticle,
  deleteArcticle,
  getArticle,
  getUserArticle,
  searchArticle,
  updateArticle,
} from "../controllers/article.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

export const articleRoute = express.Router();

//Public
articleRoute.get("/toutArticles", getArticle); //recuperer article public
articleRoute.get("/chercherArticle", searchArticle); //rechercher article

//Priver
articleRoute.post("/ajouterArticle", protectRoute, addArticle); //ajouter article
<<<<<<< HEAD
articleRoute.get("/mesArticles", protectRoute, getUserArticle); //recuperer articles utilisateur
articleRoute.delete("/:id", protectRoute, deleteArcticle); //supprimer article
=======
articleRoute.get("/articles/me", protectRoute, getUserArticle); //recuperer articles utilisateur
articleRoute.delete("/delete/:id", protectRoute, deleteArcticle); //supprimer article
>>>>>>> e47eef0 (correction des rendu data controller)
articleRoute.put("/:id", protectRoute, updateArticle); //modifier article
