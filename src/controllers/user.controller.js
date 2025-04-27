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
    const data = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };
    if (user) {
      const token = generatedToken(user._id, res);
      await user.save();
      console.log("enregistrer avec succer", user._id, user.name);
      return res.status(201).json({
        message: "Enregistrer avec succes",
        data,
        token,
      });
    } else {
      return res
        .statut(401)
        .json({ message: "Desole, enregistrement echouer" });
    }
  } catch (error) {
    console.log("Echec, verifier le server", error.message);
    return res.status(500).json({ message: error });
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

    const token = generatedToken(userExist._id, res);
    const data = {
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      role: userExist.role,
    };

    console.log("connecter avec succes...");
    return res.status(201).json({
      message: "connecter avec succes",
      data,
      token,
    });
  } catch (error) {
    console.log("ERREUR lors de la connection ou server", error.message);
    return res
      .status(500)
      .json({ message: "ERREUR lors de la connection OU server", error });
  }
};

//Deconnexion controller
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Deconnecter avec succes" });
  } catch (error) {
    return res
      .status(501)
      .json({ message: "Deconnexion echouer, Probleme server" });
    console.log("Deconnexion echouer, verifier server", error.message);
  }
};

//Verification d'Athentification controller
export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non authentifié, veuillez vous connecter" });
    }
    const user = req.user;
    return res.status(200).json({ message: "Utilisateur authentifié", user });
  } catch (error) {
    console.error("Echec d'Authentification", error.message);
    return res.status(401).json({
      message: "Echec d'Authenfication, verifier server",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const getuser = await User.find({}).sort({ createdAt: -1 });
    const count = await User.countDocuments();

    const data = {
      getuser,
      count,
    };
    return res
      .status(200)
      .json({ succes: true, message: "Recuperer avec succes", data });
  } catch (error) {
    return res.status(500).json({
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
      return res
        .status(401)
        .json({ succes: false, message: "utilisateur non trouver" });
    }

    const deleteUser = await user.deleteOne({ _id: req.params.id });
    return res.status(201).json({
      succes: true,
      message: "Supprimer avec succes",
      user: deleteUser,
    });
  } catch (error) {
    return res.status(500).json({
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
      return res
        .status(401)
        .json({ succes: false, message: "Invalid credential" });
    }
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({
      succes: true,
      message: "Information accorde",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      succes: false,
      message: "ERREUR, verifier server",
      error: error.message,
    });
  }
};
