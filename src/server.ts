import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./app/auth/routes";
import schoolRoutes from "./app/school/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    allowedHeaders: "Content-Type, Authorization, x-access-token",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/school", schoolRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
