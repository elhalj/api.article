import jwt from "jsonwebtoken";

export const generatedToken = (userId, res) => {
  // Validation du secret JWT
  if (!process.env.JWT_TOKEN_SECRET) {
    throw new Error("[ERREUR] JWT_TOKEN_SECRET manquant dans .env");
  }

  // Génération du token
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  // Configuration du cookie
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
<<<<<<< HEAD
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en ms
    httpOnly: true, // Protection contre XSS
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Protection contre CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod
    path: "/", // Accessible sur tout le site
    domain: process.env.NODE_ENV === "production" ? ".publicblog-ten.vercel.app" : "localhost"
=======
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax", // Critical pour CORS
    secure: isProduction,
    path: "/",
    domain: isProduction ? "https://publicblog-ten.vercel.app" : undefined, // À adapter
>>>>>>> e47eef0 (correction des rendu data controller)
  };

  res.cookie("jwt", token, cookieOptions);

  return token; // Optionnel pour usage côté client
};
