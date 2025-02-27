import { User } from "../models/Users.model.js";
import bcrypt from "bcryptjs";
import { generatedToken } from "../utils/utils.js";

//Creation de compte controller
export const signUp = async (req, res) => {
  const { email, name, password, role } = req.body;
  try {
    if (!email || !name || !password || !role) {
      return res.status(400).json({
        message: "Desole, Vous devez d'abord remplir tous les champs",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({ message: "l'utilisateur exist deja" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      name,
      password: hashPassword,
      role,
    });

    if (user) {
      generatedToken(user._id, res);
      await user.save();
      res.status(201).json({
        message: "Enregistrer avec succes",
        _id: user._id,
        name: user.name,
        role: user.role,
      });
      console.log("enregistrer avec succer", user._id, user.name);
    } else {
      res.statut(401).json({ message: "Desole, enregistrement echouer" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log("Echec, verifier le server", error.message);
  }
};

//connexion controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({
        message:
          "l'utilisateur n'existe pas, veuillez s'il vous plait vous inscrire",
      });
    }
    const isPasswordCorrect = bcrypt.compare(password, userExist.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "password incorrect OU n'existe pas" });
    }

    generatedToken(userExist._id, res);
    res.status(201).json({
      message: "connecter avec succes",
      _id: userExist._id,
    });
    console.log("connecter avec succes...");
  } catch (error) {
    res
      .status(500)
      .json({ message: "ERREUR lors de la connection OU server", error });
    console.log("ERREUR lors de la connection ou server", error.message);
  }
};

//Deconnexion controller
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Deconnecter avec succes" });
  } catch (error) {
    res.status(501).json({ message: "Deconnexion echouer, Probleme server" });
    console.log("Deconnexion echouer, verifier server", error.message);
  }
};

//Verification d'Athentification controller
export const checkAuth = (req, res) => {
  try {
    // Vérifiez si l'utilisateur est authentifié
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non authentifié, veuillez vous connecter" });
    }
    res.status(201).json(req.user);
  } catch (error) {
    res.status(401).json({
      message: "Echec d'Authenfication, verifier server",
      error: error,
    });
    console.log("Echec d'Authentification", error.message);
  }
};
