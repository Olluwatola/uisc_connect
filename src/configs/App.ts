import express, { Express } from "express";
import cors from "cors";
import routes from "../routes";

const app: Express = express();

app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: "*" }));

app.use(
  "/api",
  //upload.any(),
  routes
);

export default app;
