import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import { dbConnect } from "./database/db.js";
import { routes } from "./routes/user.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { articleRoute } from "./routes/article.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
const allowlist = [
  "http://localhost:3000",
  "https://posts-seven-red.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || process.env.NODE_ENV === "production"
          ? allowlist.includes(origin)
          : origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Total-Count"],
  })
);

app.use("/api/auth", routes);
app.use("/api/article", articleRoute);
// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
  console.error("Erreur:", err);
  res.status(500).json({
    status: "error",
    message: "Erreur interne du serveur",
  });
});

app.get("/", (req, res) => {
  res.send("server est en marche...");
});

app.listen(port, () => {
  console.log(`server actif localhost localhost:${port}`);
  dbConnect();
});
