import express from "express";
import {
  checkAuth,
  deleteUser,
  getUser,
  getUser_me,
  getMe,
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

export const routes = express.Router();

routes.post("/signUp", signUp); //creation de compte
routes.post("/login", login); //connexion
routes.post("/logout", logout); //connexion
routes.get("/check", protectRoute, checkAuth); //verification d'authenfication
routes.get("/me", protectRoute, getMe); //recuperer donnees utilisateur

//Privee Admin
routes.get("/getUser", protectRoute, getUser); //recuperer tous les utilateurs
routes.get("/:id", protectRoute, getUser_me); //recuperer information personnel
routes.delete("/:id", protectRoute, deleteUser); //supprimer utilisateur
