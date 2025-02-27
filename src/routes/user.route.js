import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

export const routes = express.Router();

routes.post("/signUp", signUp); //creation de compte
routes.post("/login", login); //connexion
routes.post("/logout", logout); //connexion
routes.get("/checkAuth", protectRoute, checkAuth); //verification d'authenfication
