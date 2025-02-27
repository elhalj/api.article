import jwt from "jsonwebtoken";

export const generatedToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  // 2. Configuration du cookie
  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en ms
    httpOnly: true, // Protection contre XSS
    sameSite: "Strict", // Protection contre CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod
    path: "/", // Accessible sur tout le site
    // domain: ".votredomaine.com", // Optionnel (pour les sous-domaines)
  };

  // 3. Envoi du cookie via la réponse
  res.cookie("jwt", token, cookieOptions);
};
