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
articleRoute.get("/toutAticles", getArticle); //recuperer article public
articleRoute.get("/chercherArticle", searchArticle); //rechercher article

//Priver
articleRoute.post("/ajouterArticle", protectRoute, addArticle); //ajouter article
articleRoute.get("/mesActicles", protectRoute, getUserArticle); //recuperer articles utilisateur
articleRoute.delete("/:id", protectRoute, deleteArcticle); //supprimer article
articleRoute.put("/:id", protectRoute, updateArticle); //modifier article
