import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
