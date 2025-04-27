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
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api", routes);
app.use("/api/article", articleRoute);

app.get("/", (req, res) => {
  res.send("server est en marche...");
});

app.listen(port, () => {
  console.log(`server actif localhost localhost:${port}`);
  dbConnect();
});
