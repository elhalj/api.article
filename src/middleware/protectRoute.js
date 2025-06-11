import jwt from "jsonwebtoken";
import { User } from "../models/Users.model.js";

export const protectRoute = async (req, res, next) => {
  let token;
  // Vérifier si le token est dans le Header authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extraire le token du header bearer
    token = req.headers.authorization.split(" ")[1];
  }
  // verifier si le token est dans le cookies
  else if (
    typeof req.cookies.token !== undefined &&
    req.cookies.token !== null
  ) {
    // extraire le token du cookies
    token = req.cookies.token;
  }
  // verifier si le token existe
  if (!token) {
    return res.status(401).json({
      message: "Autorisation refuser - Pas autorisé à acceder à cette route",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    //  ajouter l'utilisateur à la requette
    req.user = await User.findById(decode.user.id);
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non autorisé, utilisateur non authentifié" });
    }
    next();
  } catch (error) {
    console.log("ERREUR dans la protection du route", error);
    return res
      .status(501)
      .json({ message: "Erreur dans la protection route -  verifier server" });
  }
};
