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
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
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
    const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
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
// controllers/user.controller.js
export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ 
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.log("error to checkAuth controller", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const getuser = await User.find({}).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ suuces: true, message: "Recuperer avec succes", Users: getuser });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message:
        "ERREUR lors de ls recuperation des utilisateur, verifier server",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res
        .status(401)
        .json({ succes: false, message: "utilisateur non trouver" });
    }

    const deleteUser = await user.deleteOne({ _id: req.params.id });
    res.status(201).json({
      succes: true,
      message: "Supprimer avec succes",
      user: deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "ERREUR, verifier server",
      error: error.message,
    });
  }
};

export const getUser_me = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(401).json({ succes: false, message: "Invalid credential" });
    }
    res
      .status(200)
      .json({
        succes: true,
        message: "Information accorde",
        user: [user.name, user.email],
      });
  } catch (error) {
    res.status(500).json({
      succes: false,
      message: "ERREUR, verifier server",
      error: error.message,
    });
  }
};

// controllers/user.controller.js
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Utiliser req.user._id
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    
    res.json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
