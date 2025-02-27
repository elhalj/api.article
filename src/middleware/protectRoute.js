import jwt from "jsonwebtoken";
import { User } from "../models/Users.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res
        .status(401)
        .json({ message: "Autorisation refuser - Token invalide" });
    }

    const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    if (!decode) {
      res.status(401).json({ message: "Autorisation refuser - Pas de token" });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      res.status(401).json({ message: "Utilisateur Inexistant" });
    }
    req.user = user;
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non autorisé, utilisateur non authentifié" });
    }
    next();
  } catch (error) {
    res
      .status(501)
      .json({ message: "Erreur dans la protection route -  verifier server" });
    console.log("ERREUR dans la protection du route", error);
  }
};
